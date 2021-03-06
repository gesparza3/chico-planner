import re
import sys
import json
from collections import defaultdict
import requests
from bs4 import BeautifulSoup
import networkx as nx


class Graph:
    def __init__(self):
        self.edges = []

    def addEdge(self, link):
        self.edges.append(link)

    def printGraph(self):
        for link in self.edges:
            print(link)


class Course:
    "Courses and their attributes"
    def __init__(self, name, desc, units):
        self.name = name
        self.prereqs = set()
        self.prereqOptions = set()
        self.children = set()
        self.description = desc
        self.units = units

    def addPreReqs(self, p):
        self.prereqs = p

    def addPreReqOptions(self, p):
        self.prereqOptions = p

    def addChild(self, c):
        self.children.add(c)

    def printCourse(self):
        print(self.name)
        print(self.description)
        print(self.prereqs)
        print(self.units)


def getDegreeUrl(degree):

    # Check argument
    if degree in ['CSCI', 'csci']:
        degree_url = 'http://catalog.csuchico.edu/viewer/18/CSCI/CSCINONEBS.html'
        degree = 'CSCI'

    elif degree in ['CINS', 'cins']:
        degree_url = 'http://catalog.csuchico.edu/viewer/18/CSCI/CINSNONEBS.html'
        degree = 'CINS'

    elif degree in ['EECE', 'eece']:
        degree_url = 'https://catalog.csuchico.edu/viewer/13/ENGR/CMPENONEBS.html'
        degree = 'EECE'

    else:
        print("YIKES")
        sys.exit()

    return degree_url


def scrapeInfo(url):
    course_list = set()
    soup = BeautifulSoup(requests.get(url).text, 'html.parser')
    # Take ut the <div> of the name and get its value
    for course in soup.find_all('tr'):
        if course.get('class') is not None:
            course_name = course.contents[0].text.strip()
            course_units = course.find_next('td', attrs={'class':'courseUnits'}).text.strip()
            if "coursePrereq" in str(course.find_next('span').get('class')):
                p_block = course.find_next('span').text
                desc = course.find_next('span', attrs={'class':'courseDescr'}).text
                pre_reqs = set(re.findall(r'[A-Z]{4} \d{3}\w?', str(p_block)))
                pre_req_options_pre = re.findall(r'([A-Z]{4} \d{3}\w?)\sor', str(p_block))
                pre_req_options_post = re.findall(r'or\s([A-Z]{4} \d{3}\w?)', str(p_block))
                pre_req_options = set(pre_req_options_pre).union(pre_req_options_post)
                new_course = Course(course_name, desc, course_units)
                new_course.addPreReqs(pre_reqs)
                new_course.addPreReqOptions(pre_req_options)
                course_list.add(new_course)

            else:
                course_list.add(Course(course_name, desc, course_units))

    return course_list


def addNonListedCourses(myset):
    missing_classes = set()
    for course in myset:
        course_names = set(c.name for c in myset)
        difference = course.prereqs.difference(course_names)
        missing_classes.update(difference)

    for m in missing_classes:
        myset.add(Course(m, "Missing desc", 'Missing units'))


def addChildren(myset):
    for c in myset:
        for r in myset:
            if c.name in r.prereqs:
                c.addChild(r.name)


def dfs(graph, start):
    visited, stack = set(), [start]
    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            stack.extend(graph[vertex] - visited)
    return visited


def findUniqueGraphs(myset):
    graph_list = {}
    adj_list = defaultdict(set)
    for c in myset:
        for p in c.children:
            adj_list[c.name].add(p)

    for c in myset:
        if len(c.prereqs) == 0:
            graph_list[c.name] = dfs(adj_list, c.name)

    for node in graph_list:
        print(node + '**********')

def generateEdges(myset):
    course_links = []
    for c in myset:
        for r in c.children:
            course_links.append((
                str(c.name),
                str(r)
                ))
    return course_links


def groupGraphs(links, connected_components):
    graphs = []
    for c in range(0, len(connected_components)):
        graphs.append(Graph())

    iters = 0
    for link in links:
        for component in connected_components:
            if set(link).issubset(set(component)):
                graphs[iters].addEdge([x.replace(' ', '') for x in list(link)])
            iters += 1
        iters = 0
    return graphs


def generateAdjList(myset):
    adj_list = {}
    for c in myset:
        adj_list[c.name.replace(' ', '')] = list([x.replace(' ', '') for x in c.children])
    with open('adj.json', 'w') as outfile:
        json.dump(adj_list, outfile)


def writeToFile(mygraphs):
    iters = 1
    for g in mygraphs:
        with open('graph_' + str(iters) + '.json', 'w') as outfile:
            json.dump(g.edges, outfile)
        iters += 1


def createNodeData(myset):
    node_data = {}
    for c in myset:
        node_data[c.name.replace(' ', '')] = {
            "desc": c.description,
            "parents": [x.replace(' ', '') for x in list(c.prereqs)],
            "parent_options": [x.replace(' ', '') for x in list(c.prereqOptions)],
            "children": [x.replace(' ', '') for x in list(c.children)],
            "units": c.units
        }
    with open('node_data.json', 'w') as outfile:
            json.dump(node_data, outfile)


def main():
    deg_url = getDegreeUrl(sys.argv[1])
    myset = scrapeInfo(deg_url)
    addNonListedCourses(myset)
    addChildren(myset)
    links = generateEdges(myset)
    graph = nx.Graph(links)
    cc = [tuple(c) for c in nx.connected_components(graph)]
    mygraphs = groupGraphs(links, cc)
    writeToFile(mygraphs)
    generateAdjList(myset)
    createNodeData(myset)

if __name__ == '__main__':
    main()
