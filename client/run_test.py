import time
import os
import json
from lackey import click, doubleClick, rightClick, wait
import pyautogui
import psycopg2
import base64


class Run_Test:
    def __init__(self):
        print("Init is going baby!!!")
        self._conn = psycopg2.connect("dbname=goodxtest user=postgres password=masterkey host=192.168.2.170")
        print("Coonection DOne daar vat hy!!")
        self.cur = self._conn.cursor()

    def _load_test_suite(self, test_name):
        print("Load Test Suite: ", test_name)
        self.cur.execute("SELECT name, tests FROM global.test_suites WHERE name = %s;", (test_name,))
        test_raw = self.cur.fetchone()
        test = {"name": test_raw[0], "tests": json.loads(test_raw[1])}

        return test


    def _load_test(self, test_name):
        print("Load Test Case: ", test_name)
        self.cur.execute("SELECT name, actions FROM global.test_cases WHERE name = %s;", (test_name,))
        test_raw = self.cur.fetchone()
        test = {"name": test_raw[0], "actions": json.loads(test_raw[1])}
        print("Load Test Case query: ", test_raw)
        print("Load Test After Json Load: ", test)
        
        return test


    def _load_image(self, image_id, get_type="all"):
        print("Load Image")
        if get_type == "all":
            self.cur.execute("SELECT name, image FROM global.images WHERE id = %s;", (image_id,))
            image = self.cur.fetchone()
        elif get_type == "image":
            self.cur.execute("SELECT image FROM global.images WHERE id = %s;", (image_id,))
            image = self.cur.fetchone()[0]
            print("FRESH OUT OF DB IMAGE: ", type(image))
            #image = base64.b64decode(image)
            #with open(image_id, "wb") as f:
            #    f.write(image)
            print("THE IMAGE: ", image)
        elif get_type == "name":
            self.cur.execute("SELECT name FROM global.images WHERE id = %s;", (image_id,))
            image = self.cur.fetchone()
        else:
            image = None

        return image_id


    def runTestSuite(self, model):
        print("runTestSuite started")
        suite_results = []
        # sorted(list_to_be_sorted, key=lambda k: k['order'])
        # Load all the test before you begin to execute them. So that the tests are equally as fast.
        # {'tests': [{'name': 'testing1', 'type': 'test'}, {'name': 'testin2', 'type': 'test'}], 'client': ['192.168.1.205', 49787]}
        # while suite_results == None:
        #     time.sleep(1)
        #     print("Waiting for test results...")

        # suite_results = self._parent.suite_results
        # self._parent.suite_results = None
        print("Model: ", type(model))
        for index, test in enumerate(model):
            print("Loop index: ", index)
            print("Loop test: ", test)
            if test['type'] == 'suite':
                test_suite = self._load_test_suite(test['name'])
                suite_results.append({
                    "name": test_suite["name"],
                    "index": index,
                    "type": "suite",
                    "results": self.runTestSuite(test_suite["tests"])
                })
            elif test['type'] == 'test':
                test_ = self._load_test(test['name'])
                suite_results.append({
                    "name": test_["name"],
                    "index": index,
                    "type": "test",
                    "results": self._run_test(test_)
                })
        print("Exiting runTestSuite")
        return suite_results

    def _run_test(self, model):
        print("_run_test DO the actions: ", model)
        test_result =  {
            "failed_actions": [],
            "success_actions": []
        }

        for index, action in enumerate(model['actions']):
            try:
                if action['action'] == 'click':
                    for _ in range(int(action.get('repeat', '1') or '1')):
                        click(self._load_image(action['data'], "image"))
                if action['action'] == 'r_click':
                    for _ in range(int(action.get('repeat', '1') or '1')):
                        rightClick(self._load_image(action['data'], "image")[1])
                if action['action'] == 'doubleclick':
                    for _ in range(int(action.get('repeat', '1') or '1')):
                        doubleClick(self._load_image(action['data'], "image")[1])
                if action['action'] == 'wait':
                    for _ in range(int(action.get('repeat', '1') or '1')):
                        wait(self._load_image(action['data'], "image")[1])
                if action['action'] == 'clickwait':
                    for _ in range(int(action.get('repeat', '1') or '1')):
                        click(wait(self._load_image(action['data'], "image")[1]))
                if action['action'] == 'type':
                    for _ in range(int(action.get('repeat', '1') or '1')):
                        pyautogui.typewrite(action['data'])
                if action['action'] == 'keycombo':
                    keys = action['data'].split('+')
                    for _ in range(int(action.get('repeat', '1') or '1')):
                        pyautogui.hotkey(*keys)
                if action['action'] == 'keypress':
                    for _ in range(int(action.get('repeat', '1') or '1')):
                        pyautogui.typewrite(action['data'])
                if action['action'] == 'close':
                    for _ in range(int(action.get('repeat', '1') or '1')):
                        pyautogui.hotkezy('alt', 'f4')
                test_result["success_actions"].append({
                    "index": index,
                    "action": action["action"],
                    "data": self._load_image(action['data'], "name")
                })
            except Exception as ex:
                test_result["failed_actions"].append({
                    "index": index,
                    "action": action["action"],
                    "data": self._load_image(action['data'], "name"),
                    "error": str(ex.__doc__)
                })
        print("Existing _run_test DO the Actions")
        return test_result
