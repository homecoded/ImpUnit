ImpUnit
=======

A very light-weight unit-testing framework written in Javascript.

* very small (under 150 lines of code, compressed size around 1.5kB) and is very easy to use
* supports multiple test suites
* provides assertTrue and assertEquals methods
* a test-suite object is scanned for test-methods and executed
* tests are run automatically in an sequential synchronous order
* several instances of impunit can live peacefully together in one project
* support for asynchronous tests

future improvements:

* support for assertError (check if a certain condition leads to an error as expected)
* add a possibility to add a test to the test chain from within the test, so you don't need to maintain a list manually

incorporated improvements:

* improve code to use only single quotes
* provide number of asynchronous tests
* passing and executing an arbitrary number of test suites with one "runTests" call
* added _setup and _teardown functionality

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

Setup and Teardown
------------------

You can define setup and tear-down methods in your tests that will be run before (setup) and after (teardown) each test.
If you need the same variables or objects in every test you can use these methods to create them for. No need to copy
the same initialization and cleanup code into every test.


	 var testSuite = {

	    _setup : function () {
	        // put all initilization code here
	        this.variable = 'init';
	    }

	    _teardown : function () {
	        // put all the code for cleanup here
	        this.variable = null;
	    }

 		_testFunction : function () {
 			this.variable += 'run';
 			assertEqual( this.variable, 'initrun' "My variable is initialized");
 		},

 	};


Asynchronous Tests
------------------

Since you never know when an asynchronous test is finished, they are handled aside 
from synchronous tests. To work with asynchronous tests you can use callbacks.
Define them in your test and pass on to ImpUnit. They will be altered in
a way that ImpUnit is later able to identify to which test the callback belongs.

Here is a sample definition of an asynchronous test :

	var testsuite = {
        _testAsync : function () {
			var asynchCallback = impunit.asyncCallback(function () {
				impunit.assertTrue(false, "The async test failed");
			});
			setTimeout(asynchCallback, 200);
        }	
	};     
	
Note: You can always check the file tests.js for more examples of asynchronous
tests. 	

Running Tests
-------------

You can run the tests by calling the runTests method. Pass your test-suite
object to the function as parameter, which will then be inspected by ImpUnit and
all methods starting with "_test" will be executed.

	impunit.runTests(testSuite);

Tests fail if ...

* an assert condition fails	
* any error is thrown within the function

You can bundle a list of test in an array and pass it to the impunit.runTests-method:

    var tests = [testSuite1, testSuite2];
	impunit.runTests(tests);


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

Interpreting Asynchronous Results
---------------------------------

Calling "runTests" will also start all asynchronous tests within a test suite.
You can specify a callback that will inform your code if an assert-method
was run. This callback may be called several times during a test due to the fact
that it is called every time an assert method (like assertTrue, or assertEqual)
is executed.

You can use ImpUnits methods to check if there are error messages for asynchronous tests
within the callback:
	
	function onAsyncCallbackFinished() {
		alert("Asynchronous Tests failed: "	+ impunit.asyncTestsFailed() + "</p>"
				+ "<pre>"" + impunit.asyncMessages() + "</pre>";
	}  
	impunit.onAsyncTestFailed(onAsyncCallbackFinished);
	

API Methods
-----------

Note: Some API functionality is separated into functions for asynchronous or
synchronous tests. This applies mainly to getter methods for test results.
For these methods I only wrote the documentation once and separated the
method names with a "/". 

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

	impunit.messages() / impunit.asyncMessages()

This method returns all the error messages gathered during running the tests.
If no tests were run or no tests failed it will return an empty string.

	impunit.testsFailed() / impunit.asyncTestsFailed()
	
This method returns the number of tests failed in the last run. If no tests were 
run yet it will return -1.

	impunit.testsRun() / impunit.asyncTestsRun()
	
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
