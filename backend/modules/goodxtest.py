import errno
import glob
import json
import logging
import os
import sys
import time
from random import *

from lib import database_manager

logging.basicConfig(format='%(asctime)s %(message)s', level=logging.INFO)

# Global variables
_modulename = 'goodxtest'
DATABASE = 'goodxtest'

try:
    with open("settings.json") as settings_file:
        SETTINGS_FILE = json.load(settings_file)
except:
    raise Exception("NO SETTINGS JSON FILE FOUND")

DB_SETTINGS = SETTINGS_FILE.get("databases", [])

# Class
class goodxtest():
    def __init__(self, parent, getDatabase):
        self._parent = parent
        self.getDatabase = getDatabase
        self.defualt_db_conn = database_manager.DatabaseConnection(DB_SETTINGS[0])

    def saveImage(self, session, image):
        self.defualt_db_conn.executeSQL("INSERT INTO global.images (name, image) values ('{}', '{}')".format(image['name'], image['file']))
        return 'success'

    def getClients(self, session):
        clients = self._parent.get_clients()[0]

        return list(clients.keys())

    def getTestsCount(self, session):
        testsCount = self.defualt_db_conn.executeSQLWithResult("SELECT COUNT(*) FROM global.test_cases;", ('',''))

        return testsCount[0]["count"]

    def getSuitesCount(self, session):
        testSuitesCount = self.defualt_db_conn.executeSQLWithResult("SELECT COUNT(*) FROM global.test_suites;", ('',''))

        return testSuitesCount[0]["count"]

    def getTests(self, session):
        tests = self.defualt_db_conn.executeSQLWithResult("SELECT name, description FROM global.test_cases;", ('',''))
        tests[0]['type'] = 'test'

        return tests

    def getSuites(self, session):
        testSuites = self.defualt_db_conn.executeSQLWithResult("SELECT name, description FROM global.test_suites;", ('',''))
        testSuites[0]['type'] = 'suite'

        return testSuites

    def getImages(self, session, get_method):
        """
        getImages: params (self, sessoin, get_method)
                   get_method is a object, constructed {'method': '', 'value': ''}
                   This is handy to say get the last 10 images or 50
                   EXMAPLE: {'method': 'last', 'value': '10'}
        """
        images = ''
        method = get_method['method']
        value = get_method['value']

        if method == 'last':
            images = self.defualt_db_conn.executeSQLWithResult("SELECT id, name, image FROM global.images ORDER BY id DESC LIMIT %s;", (value,))
        elif method == 'specific_name':
            images = self.defualt_db_conn.executeSQLWithResult("SELECT name FROM global.images WHERE id = %s;", (value,))
        elif method == 'specific':
            images = self.defualt_db_conn.executeSQLWithResult("SELECT name, image FROM global.images WHERE id = %s;", (value,))

        return images

    def saveTest(self, session, model):
        self.defualt_db_conn.executeSQL("""
            INSERT INTO global.test_cases (name, description, actions) values ('{name}', '{description}', '{actions}')
            ON CONFLICT (name)
            DO UPDATE SET
                name = '{name}',
                description = '{description}',
                actions = '{actions}'
            WHERE
                test_cases.name = '{name}';
            """.format(name=model['name'], description=model['description'], actions=json.dumps(model['actions'])))

    def saveTestSuite(self, session, model):
        self.defualt_db_conn.executeSQL("""
            INSERT INTO global.test_suites (name, description, tests) values ('{name}', '{description}', '{tests}')
            ON CONFLICT (name)
            DO UPDATE SET
                name = '{name}',
                description = '{description}',
                tests = '{tests}'
            WHERE
                test_suites.name = '{name}';
            """.format(name=model['name'], description=model['description'], tests=json.dumps(model['tests'])))

    def loadTestSuite(self, session, test_name):
        return self._load_test_suite(test_name)

    def _load_test_suite(self, test_name):
        test = self.defualt_db_conn.executeSQLWithResult("SELECT name, description, tests FROM global.test_suites WHERE name = %s;", (test_name,))
        test[0]['tests'] = json.loads(test[0]['tests'])
        test = json.dumps(test[0])
        return json.loads(test)

    def loadTest(self, session, test_name):
        return self._load_test(test_name)

    def _load_test(self, test_name):
        test = self.defualt_db_conn.executeSQLWithResult("SELECT name, description, actions FROM global.test_cases WHERE name = %s;", (test_name,))
        test[0]['actions'] = json.loads(test[0]['actions'])
        test = json.dumps(test[0])
        return json.loads(test)

    def runTestSuite(self, session, model):
        # sorted(list_to_be_sorted, key=lambda k: k['order'])
        # Load all the test before you begin to execute them. So that the tests are equally as fast.
        # {'tests': [{'name': 'testing1', 'type': 'test'}, {'name': 'testin2', 'type': 'test'}], 'client': ['192.168.1.205', 49787]}
        self._parent.send_client(model)
        # while self._parent.suite_results == None:
        #     time.sleep(1)
        #     print("Waiting for test results...")

        # suite_results = self._parent.suite_results
        # self._parent.suite_results = None

        # for index, test in enumerate(model['tests']):
        #     if test['type'] == 'suite':
        #         test_suite = self._load_test_suite(test['name'])
        #         suite_results.append({
        #             "name": test_suite["name"],
        #             "index": index,
        #             "type": "suite",
        #             "results": self.runTestSuite(session, test_suite)
        #         })
        #     elif test['type'] == 'test':
        #         test_ = self._load_test(test['name'])
        #         suite_results.append({
        #             "name": test_["name"],
        #             "index": index,
        #             "type": "test",
        #             "results": self._run_test(test_)
        #         })
        # print("KKKKKKKKKKKKKKKKKKKKKKKKKKKKAAAAAAAAAAAAASSSSSSSSSSSSSSSSSSSSSSSSSS BBBBBBBBBBBBBBBBBRRRRRRRRRRRRRRRRRRAAAAAAAAAAAAAAAA!!!!!!!!!!!!!!!!!!!!")
        # return suite_results

    def runTest(self, session, model):
        self._run_test(model)

    # def _run_test(self, model):
    #     test_result =  {
    #         "failed_actions": [],
    #         "success_actions": []
    #     }
    #     for index, action in enumerate(model['actions']):
    #         try:
    #             if action['action'] == 'click':
    #                 for k in range(int(action.get('repeat', '1') or '1')):
    #                     _click(os.path.normpath(os.getcwd() + '\\images\\' + action['data'] + '.png'))
    #             if action['action'] == 'r_click':
    #                 for k in range(int(action.get('repeat', '1') or '1')):
    #                     _rightClick(os.path.normpath(os.getcwd() + '\\images\\' + action['data'] + '.png'))
    #             if action['action'] == 'doubleclick':
    #                 for k in range(int(action.get('repeat', '1') or '1')):
    #                     _doubleClick(os.path.normpath(os.getcwd() + '\\images\\' + action['data'] + '.png'))
    #             if action['action'] == 'wait':
    #                 for k in range(int(action.get('repeat', '1') or '1')):
    #                     _wait(os.path.normpath(os.getcwd() + '\\images\\' + action['data'] + '.png'), int(action['delay']))
    #             if action['action'] == 'clickwait':
    #                 for k in range(int(action.get('repeat', '1') or '1')):
    #                     _click(_wait(os.path.normpath(os.getcwd() + '\\images\\' + action['data'] + '.png'), int(action['delay'])))
    #             if action['action'] == 'type':
    #                 for k in range(int(action.get('repeat', '1') or '1')):
    #                     pyautogui.typewrite(action['data'])
    #             if action['action'] == 'keycombo':
    #                 keys = action['data'].split('+')
    #                 for k in range(int(action.get('repeat', '1') or '1')):
    #                     pyautogui.hotkey(*keys)
    #             if action['action'] == 'keypress':
    #                 for k in range(int(action.get('repeat', '1') or '1')):
    #                     pyautogui.typewrite(action['data'])
    #             if action['action'] == 'close':
    #                 for k in range(int(action.get('repeat', '1') or '1')):
    #                     pyautogui.hotkey('alt', 'f4')
    #             test_result["success_actions"].append({
    #                 "index": index,
    #                 "action": action["action"],
    #                 "data": action["data"]
    #             })
    #         except Exception as ex:
    #             test_result["failed_actions"].append({
    #                 "index": index,
    #                 "action": action["action"],
    #                 "data": action["data"],
    #                 "error": str(ex.__doc__)
    #             })
    #     return test_result

    def searchTests(self, session, search_term):
        tests = self.getTests(session)
        tests_ = []
        for test in tests:
            if test['name'].lower().find(search_term.lower()) > -1:
                tests_.append(test)
        return tests_

    def searchSuites(self, session, search_term):
        suites = self.getSuites(session)
        suites_ = []
        for suite in suites:
            if suite['name'].lower().find(search_term.lower()) > -1:
                suites_.append(suite)
        return suites_

    def login(self, session, username, password):
        # Ensure the user is not logged in.
        if session is None:
            return self._parent.doLogin(DATABASE, username, password)

        # If the user is logged in , logout the user and login again with the new session id. This is 
        else:
            self._parent.doLogout()
            return self._parent.doLogin(DATABASE, username, password)

    def logout(self, session):
        if session is None:
            raise Exception('NOT LOGGED IN')
        else:
            return self._parent.doLogout()

    def getUser(self, session):
        return self._parent.getUser()

    def getLoggedIn(self, session):
        return self._parent.getLoggedIn()


class TestLoader:
    """
    Get test case/suite to load all data off.
    Get test actions, images (base64) and settings etc.
    Post everying to remote client in json.
    """
    def get_all_test_data(self, test_case_suite_name):
        jsonData = {}
        return jsonData


Module = goodxtest
