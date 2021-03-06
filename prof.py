from imports import *

script_dir = os.path.dirname(__file__)

profs_dict = {}


class CaseInsensitiveDict(dict):

    temp = {}

    def __init__(self, data):
        self.temp = dict((k.lower(), k) for k in data)
        for k in data:
            self[k] = data[k]


    def __contains__(self, k):
        return k.lower() in self.temp


    def __delitem__(self, k):
        key = self.temp[k.lower()]
        super(CaseInsensitiveDict, self).__delitem__(key)
        del self.temp[k.lower()]


    def __getitem__(self, k):
        key = self.temp[k.lower()]
        return super(CaseInsensitiveDict, self).__getitem__(key)


    def get(self, k, default=None):
        return self[k] if k in self else default


    def __setitem__(self, k, v):
        super(CaseInsensitiveDict, self).__setitem__(k, v)
        self.temp[k.lower()] = k


with open(os.path.join(script_dir, 'prof_data.json'), 'r') as f:
    profs_dict = CaseInsensitiveDict(json.load(f))

def get_times(prof_name):
    data = CaseInsensitiveDict(profs_dict)
    result = []

    try:

        result = data[prof_name][TIMETABLE_KEY]

        if result:
            result.sort()
            result = list(result for result, _ in itertools.groupby(result))

    except:

        pass

    return result

def get_table(details):
    tb = {}

    for i in range(5):
        for j in range(4):
            tb.update({'%d%d' % (i, j): []})

    for times, venues in details:
        venues = set(v.strip() for v in venues)

        for time in times:
            tb[time] = venues

    return tb


def get_attr(prof_name, key):
    data = CaseInsensitiveDict(profs_dict)
    result = ""
    try:
        result = data[prof_name][key]
    except:
        pass
    return result


with open(os.path.join(script_dir, 'prof_data.json')) as f:
    profs = list(set(json.load(f).keys()))
    profs.sort()


def get_predefined():
    tb = [[['Monday']], [['Tuesday']], [['Wednesday']], [['Thursday']], [['Friday']]]
    for row in tb:
        for i in range(4):
            row.append([])
    timeslots = ['', '9:30 - 11:00', '11:15 - 12:45', '14:00 - 15:30', '15:45 - 17:15']
    return [tb, timeslots]

def fetch_results(prof):
    tb = [[['Monday']], [['Tuesday']], [['Wednesday']], [['Thursday']], [['Friday']]]
    timeslots = ['', '9:30 - 11:00', '11:15 - 12:45', '14:00 - 15:30', '15:45 - 17:15']
    slot_data = get_times(prof)
    dept = get_attr(prof, 'dept')
    website = get_attr(prof, 'website')

    if len(slot_data) == 0 and len(dept) == 0:
        abort(404)

    data = get_table(slot_data)

    for row in tb:
        for i in range(4):
            row.append([])

    for item in data:
        for venue in data[item]:
            if venue == '0':
                venue = 'In Dept'
            tb[int(item[0])][int(item[1])+1].append(venue)

    return [tb, timeslots, dept, website, prof.title()]
