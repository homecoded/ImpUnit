ImpUnit
=======

A very light-weight unit-testing framework written in Javascript.

* very small (under 70 lines of code, compressed size around 1kB) and very easy
* supports multiple test suites
* provides assertTrue and assertEquals methods
* a test-suite object is scanned for test-methods and executed
* tests are run automatically in an sequential synchronous order
* several instances of impunit can live peacefully together in one project

future improvements:

* support for asynchronous tests
* passing and executing an arbitrary number of test suites with one "runTests" call
* support for assertError (check if a certain condition leads to an error as expected)



Defining Tests
--------------

This repository contains the ImpUnit framework along with a test suite that tests 
it. You can look at the test suite (check tests.js) to get an immediate feeling for how
it is done. If you want to take the long road, you can check out the step-by-step
description below.

First include the impunit.js file into your html document:

	<script type="text/javascript" src="js/impunit.js"></script>

Create a test suite object. Always start your test methods with the word "_test", which is the string
token ImpUnit uses to identify them:

	var testsuite = {

		_testMath : function () {
			assertTrue( (1+1) == 2, "I did the math");
		},

		_testLolz : function () {
			assertEqual( "lol, "rofl", "No, that is not the same");
		},
	};

Note: Test suites do not litter the global namespace and give you the possibility 
to group tests together.

Running Tests
-------------

You can run the tests by calling the runTests method. Pass your test-suite
object to the function as parameter, which will then be inspected by ImpUnit and
all methods starting with "_test" will be executed.

	impunit.runTests(testSuite);

Tests fail if ...

* an assert condition fails	
* any error is thrown within the function

Interpreting The Results
------------------------

After calling "runTests" you can receive the info about the last run from
impunit and show it. You can check the "reportError" method in the tests.js
contained in the repository. Below you find another simpler implementation:

        impunit.runTests(testSuite);
        alert( "Testing done! \n"
                + "Tests run: " + impunit.testsRun() + "\n"
                + "Tests failed: " + impunit.testsFailed() + "\n"
                + "errors:\n" + impunit.messages() + "\n");

API Methods
-----------
	
	impunit.assertTrue(boolExpr, msg)

This methods will check if "boolExpr" is always true. If it is not true, an error 
message will be created and attached to an internal list. You can add an 
explanation ("msg") to the error that may help you to find the condition that 
causes the fail. This parameter is optional. The error list can be accessed 
using the method "impunit.messages()" (see below).

	impunit.assertEqual(exp1, exp2, msg)
	
This method will check if "exp1" is exactly equal to "exp2" using the === operator. 
If it fails is does the same thing as assertTrue. Just like assertTrue, 
assertEquals takes an optional explanation parameter ("msg").

	impunit.messages()

This method returns all the error messages gathered during running the tests.
If no tests were run or no tests failed it will return an empty string.

	impunit.testsFailed()
	
This method returns the number of tests failed in the last run. If no tests were 
run yet it will return -1.

	impunit.testsRun()
	
This method returns the number of tests that were executed. This can help you 
to verify e.g. if all tests were run.

	impunit.silent(value)

You can use this method to change the notification behavior of ImpUnit. Setting
"silent" to false will cause ImpUnit to display an alert box every time a 
tests fails containing info about which tests failed. The "silent" value is
set to true by default thus not showing any messages. The method returns the
current "silent" state. The "value" parameter is optional. 

	impunit.createInstance()

Returns a new instance of ImpUnit. I added this method to be able to have one
instance of ImpUnit test another.


Bottomline
----------

ImpUnit has been released under Apache2 license. With this you are free to
use it, distribute it and change it.

author: Manuel Ruelke, 01/2011
contact: http://homecoded.com