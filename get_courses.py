import re
import sys
import json
from collections import defaultdict
import requests
from bs4 import BeautifulSoup

# Check argument
if sys.argv[1] in ['CSCI', 'csci']:
    DEGREE_URL = 'http://catalog.csuchico.edu/viewer/18/CSCI/CSCINONEBS.html'
    DEGREE = 'CSCI'
    DEGREE_COLOR = 'red'

elif sys.argv[1] in ['CINS', 'cins']:
    DEGREE_URL = 'http://catalog.csuchico.edu/viewer/18/CSCI/CINSNONEBS.html'
    DEGREE = 'CINS'
    DEGREE_COLOR = 'blue'

elif sys.argv[1] in ['EECE', 'eece']:
    DEGREE_URL = 'https://catalog.csuchico.edu/viewer/13/ENGR/CMPENONEBS.html'
    DEGREE = 'EECE'
    DEGREE_COLOR = 'green'

else:
    print("YIKES")
    sys.exit()

# query website and return the html to the variable 'page'
DEGREE_PAGE = requests.get(DEGREE_URL)

# parse the html using beautiful soup and store the variable in `soup`
SOUP = BeautifulSoup(DEGREE_PAGE.text, 'html.parser')

# List to store info scraped from page
COURSE_INFO = {}

# Take ut the <div> of the name and get its value
for course in SOUP.find_all('tr'):
    if course.get('class') is not None:
        # print course.contents[0].text.strip() ,
        COURSE_TITLE = course.contents[0].text.strip()
        COURSE_INFO[COURSE_TITLE] = []
        if "coursePrereq" in str(course.find_next('span').get('class')):
            DESC = course.find_next('span').text
            PRE_REQS = re.findall(r'[A-Z]{4} \d{3}\w?', str(DESC))
            COURSE_INFO[COURSE_TITLE].append({
                'prereq' : PRE_REQS,
                'desc': course.find_next('span').find_next('span').text
                })
        else:
           # print("NA")
            COURSE_INFO[COURSE_TITLE].append({
                'prereq' : ['NA'],
                'desc' : course.find_next('span').text
                })


NODE_LIST = COURSE_INFO.keys()
for course in NODE_LIST:
    REQ_LIST = COURSE_INFO[course][0]['prereq']
    for r in REQ_LIST:
        if r not in NODE_LIST:
            COURSE_INFO[r] = []
            COURSE_INFO[r].append({
                    'prereq' : ['NA'],
                    'desc' : 'THIS IS A TEST'
                    })

# Create list of children for each course
COURSE_CHILDREN = defaultdict(list)
ROOT_LIST = []
for course in COURSE_INFO:
    for r in COURSE_INFO[course][0]['prereq']:
        COURSE_CHILDREN[r].append(course)
        if r == 'NA' and course != 'NA':
            ROOT_LIST.append(course)

# Create adjacency list for graph
ADJ_LIST = defaultdict(set)
for course in COURSE_CHILDREN:
    for p in COURSE_CHILDREN[course]:
        ADJ_LIST[course].add(p)

# Depth First Search
def dfs(graph, start):
    visited, stack = set(), [start]
    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            stack.extend(graph[vertex] - visited)
    return visited

# NODE_LIST = ADJ_LIST.keys()
VISTED_LIST = {}
for node in ROOT_LIST:
    VISTED_LIST[node] = dfs(ADJ_LIST, node)
    print(dfs(ADJ_LIST, node))

# for node in VISTED_LIST:
#     print(node + '**********')
#     for item in VISTED_LIST[node]:
#         print(item)

print("********")
print("********")
print("********")

UNIQUE_GRAPHS = []
for node in list(VISTED_LIST):
    for item in list(VISTED_LIST):
        if VISTED_LIST[node] & VISTED_LIST[item]:
            VISTED_LIST[node] = VISTED_LIST[node] | VISTED_LIST[item]
        else:
            UNIQUE_GRAPHS.append(node)

UNIQUE_GRAPHS = list(set(UNIQUE_GRAPHS))

print(UNIQUE_GRAPHS)

# # Generate links between courses
# COURSE_LINKS = []
# for course in UNIQUE_GRAPHS:
#     print('NEW GRAPH: ' + course)
#     for c in VISTED_LIST[course]:
#         for child in COURSE_INFO[c][0]['prereq']:
#             COURSE_LINKS.append([
#                 str(child),
#                 str(c)
#                 ])
#     print(COURSE_LINKS)
#     COURSE_LINKS[:] = []


# # Write to file
# with open('test.json', 'w') as outfile:
#     json.dump(COURSE_INFO, outfile)
#
# # Write to file
# with open('pre_test.json', 'w') as outfile:
#     json.dump(COURSE_CHILDREN, outfile)
