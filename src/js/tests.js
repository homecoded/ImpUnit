/*
   Copyright 2011 Manuel Rülke, http://homecoded.com

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
/*global impunit */

var globalAsyncImpunit;

var runTests = function () {

    function getImpUnitTestInstance() {
        var iuClone = impunit.createInstance();
        iuClone.silent(true);
        return iuClone;
    }

    function reportResult() {
        var result = '<h1>Testing done!</h1>'
                + '<p>Tests run: ' + impunit.testsRun() + '<br>'
                + 'Tests failed: ' + impunit.testsFailed() + '</p>'
                + '<p><pre>' + impunit.messages() + '</pre></p>';

        var results = document.getElementById('results');
        results.innerHTML = result;
        results.style.color = (impunit.testsFailed() > 0) ? '#880000' : '#008800';
    }
    
	function onAsyncCallbackFinished() {
		var results = document.getElementById('asyncResults');	
		var result = 'Asynchronous Tests run: ' + impunit.asyncTestsRun() + '<br>'
                + 'Asynchronous Tests failed: ' + impunit.asyncTestsFailed() + '</p>'
				+ '<pre>' + impunit.asyncMessages() + '</pre>';
		
		results.style.color = (impunit.asyncTestsFailed() > 0) ? '#880000' : '#008800';
		results.innerHTML = result;	
	}    

    //  test suite
    var testSuite = {

        _testInit : function _testInit() {
            var testImpUnit = getImpUnitTestInstance();
            impunit.assertTrue(testImpUnit.testsRun() <= 0);
            impunit.assertTrue(testImpUnit.testsFailed() <= 0);
        },
        _testInstanceIndependence : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testImpUnit2 = getImpUnitTestInstance();
            testImpUnit2.silent(true);
            testImpUnit.silent(false);
            impunit.assertTrue(testImpUnit.silent() !== testImpUnit2.silent(), 'silent is different');

            testImpUnit2.assertTrue(false);
            impunit.assertTrue(testImpUnit2.messages().length > 0, 'testImpUnit2 has messages');
            impunit.assertTrue(testImpUnit.messages().length === 0, 'testImpUnit has no messages');
        },

        _testNoFailNoMessage : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertTrue(true, 'test');
            impunit.assertEqual('', testImpUnit.messages(), 'test');
        },

        _testFailHasMessage : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertTrue(false, 'test2');
            impunit.assertTrue(testImpUnit.messages().length > 0, 'test');
        },

        _testAssertTrue : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertTrue(true);
            impunit.assertTrue(testImpUnit.messages().length === 0);
            testImpUnit.assertTrue(false);
            impunit.assertTrue(testImpUnit.messages().length > 0);
        },

        _testAssertEqual : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual(0, 0);
            testImpUnit.assertEqual(12, 12);
            testImpUnit.assertEqual(-12, -12);
            testImpUnit.assertEqual(12, 12);
            testImpUnit.assertEqual('', '');
            testImpUnit.assertEqual(null, null);
            testImpUnit.assertEqual(undefined, undefined);
            var a, b;
            testImpUnit.assertEqual(a, b);
            testImpUnit.assertEqual(a, undefined);
            a = b = {};
            testImpUnit.assertEqual(a, b);
            a = b = [];
            testImpUnit.assertEqual(a, b);
            impunit.assertTrue(testImpUnit.messages().length === 0);
        },

        _testAssertEqualFailCase1 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual('0', 0);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase2 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual(1, 0);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase3 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual('0', '1');
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase4 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual(null, undefined);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase5 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual(null, undefined);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase6 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual('null', null);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase7 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual(1, -1);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase8 : function () {
            var testImpUnit = getImpUnitTestInstance();
            var a = {}, b = {};
            testImpUnit.assertEqual(a, b);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase9 : function () {
            var testImpUnit = getImpUnitTestInstance();
            var a = [], b = [];
            testImpUnit.assertEqual(a, b);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testRunTestSuite : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testSuite = {
                _test1 : function () {
                    testImpUnit.assertTrue(true);
                },

                _test2 : function () {
                    testImpUnit.assertTrue(true);
                    testImpUnit.assertTrue(true);
                    testImpUnit.assertTrue(true);
                },

                _test3 : function () {
                    testImpUnit.assertEqual(12, 12);
                }
            };
            testImpUnit.runTests(testSuite);
            impunit.assertEqual(3, testImpUnit.testsRun());
            impunit.assertEqual(0, testImpUnit.testsFailed());
        },

        _testRunTestSuiteFail : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testSuite = {
                _test1 : function () {
                    testImpUnit.assertTrue(false);
                }
            };
            testImpUnit.runTests(testSuite);
            impunit.assertEqual(1, testImpUnit.testsRun());
            impunit.assertEqual(1, testImpUnit.testsFailed());
        },

        _testRunTestMultipleSuites : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testSuiteError = {
                _test1 : function () {
                    testImpUnit.assertTrue(false);
                }
            };
            var testSuiteOk = {
                _test1 : function () {
                    testImpUnit.assertTrue(true);
                }
            };
            var testSuiteOk2 = {
                _test1 : function () {
                    testImpUnit.assertTrue(true);
                    testImpUnit.assertTrue(true);
                }
            };

            testImpUnit.runTests(testSuiteOk);
            impunit.assertEqual(1, testImpUnit.testsRun());
            impunit.assertEqual(0, testImpUnit.testsFailed());
            impunit.assertTrue(testImpUnit.messages().length === 0);

            testImpUnit.runTests(testSuiteError);
            impunit.assertEqual(1, testImpUnit.testsRun());
            impunit.assertEqual(1, testImpUnit.testsFailed());
            impunit.assertTrue(testImpUnit.messages().length !== 0);

            testImpUnit.runTests(testSuiteOk2);
            impunit.assertEqual(1, testImpUnit.testsRun());
            impunit.assertEqual(0, testImpUnit.testsFailed());
            impunit.assertTrue(testImpUnit.messages().length === 0);
        },

        _testRunTestSuiteMultipleFail : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testSuiteError = {
                _test1 : function () {
                    testImpUnit.assertTrue(false);
                }
            };

            var testSuite2Errors = {
                _test1 : function () {
                    testImpUnit.assertTrue(false);
                },
                _test2 : function () {
                    testImpUnit.assertTrue(false);
                }
            };

            testImpUnit.runTests(testSuiteError);
            impunit.assertEqual(1, testImpUnit.testsRun());
            impunit.assertEqual(1, testImpUnit.testsFailed());

            testImpUnit.runTests(testSuite2Errors);
            impunit.assertEqual(2, testImpUnit.testsRun());
            impunit.assertEqual(2, testImpUnit.testsFailed());
        },

        _testExceptionFail : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testSuiteError = {
                _test1 : function () {
                    throw 'Some custom error';
                },
                _test2 : function () {
                    var s;
                    s.undefinedFunction();
                }
            };
            testImpUnit.runTests(testSuiteError);
            impunit.assertEqual(2, testImpUnit.testsFailed());
            impunit.assertEqual(2, testImpUnit.testsRun());
        },

        _testErrorMessageAccumulation : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testSuiteError = {
                _test1 : function () {
                    testImpUnit.assertTrue(false);
                }
            };
            var testSuiteError2 = {
                _test1 : function () {
                    testImpUnit.assertTrue(false);
                },
                _test2 : function () {
                    testImpUnit.assertTrue(false);
                }
            };

            testImpUnit.runTests(testSuiteError);
            var msgLen1 = testImpUnit.messages().length;
            testImpUnit.runTests(testSuiteError2);
            var msgLen2 = testImpUnit.messages().length;

            impunit.assertTrue(msgLen1 < msgLen2);
        },

        _testAsyncWorks : function () {
			var asynchCallback = impunit.asyncCallback(function () {
				impunit.assertTrue(true, 'The async test was false');
			});
			setTimeout(asynchCallback, 200);
        },
        
        _testAsyncFail : function () {
			var globalAsyncImpunit = getImpUnitTestInstance();
			var testSuite = {
				_testAsyncFailGlobal : function () {
					var cb = globalAsyncImpunit.asyncCallback(function () {
						globalAsyncImpunit.assertTrue(false);
                        globalAsyncImpunit.assertTrue(false);
					});
					setTimeout(cb, 100);
				}
			};
			globalAsyncImpunit.runTests(testSuite);
			var impcb = impunit.asyncCallback(function () {
				impunit.assertEqual(1, globalAsyncImpunit.asyncTestsFailed());
				impunit.assertTrue(globalAsyncImpunit.asyncMessages().length > 0);
				globalAsyncImpunit = null;
			});
			setTimeout(impcb, 200);
		},

        _testMultipleTestSuites : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testVar = '';
            var testSuite1 = {
                _test1 : function () {
                    testVar += 'a';
                }
            };
            var testSuite2 = {
                _test1 : function () {
                    testVar += 'b';
                },
                _test2 : function () {
                    testVar += 'c';
                }
            };

            var suites = [
                testSuite1,
                testSuite2
            ];

            testImpUnit.runTests(suites);
            impunit.assertEqual(testVar, 'abc', 'Not all testsuites were run');
        },

        _testSetupExecutedBefore : function () {
            var testImpUnit = getImpUnitTestInstance();
            var isSetupRun = false;
            var testSuite = {
                _setup: function () {
                    isSetupRun = true;
                },
                _testSetupBefore : function () {
                    impunit.assertTrue(isSetupRun, '_setup was not executed');
                }
            }
            testImpUnit.runTests(testSuite);
            impunit.assertEqual(testImpUnit.testsFailed(), 0, testImpUnit.messages());
        },

        _testTeardownExecutedAfter : function () {
            var testImpUnit = getImpUnitTestInstance();
            var isTeardownRun = false;
            var testSuite = {
                _teardown: function () {
                    isTeardownRun = true;
                },
                _testTeardownAfter : function () {
                    testImpUnit.assertTrue(!isTeardownRun, '_teardown was executed too early');
                }
            };
            testImpUnit.runTests(testSuite);
            impunit.assertEqual(testImpUnit.testsFailed(), 0, testImpUnit.messages());
            impunit.assertTrue(isTeardownRun, '_teardown was not executed');
        },

        _testTeardownExecutedAfterError : function () {
            var testImpUnit = getImpUnitTestInstance();
            var isTeardownRun = false;
            var testSuite = {
                _teardown: function () {
                    isTeardownRun = true;
                },
                _testTeardownAfter : function () {
                    notImplemented();
                }
            };
            testImpUnit.runTests(testSuite);
            impunit.assertTrue(testImpUnit.testsFailed() > 0, 'test instance has no errors');
            impunit.assertTrue(isTeardownRun, '_teardown was not executed');
        },

        _testSetupTeardownContext : function () {
            var testImpUnit = getImpUnitTestInstance();
            var beforeValue = '', afterValue = '';
            var testSuite = {
                _setup: function () {
                    this.value = 'initialized';
                },
                _teardown: function () {
                    beforeValue = this.value;
                    this.value = 'deleted';
                    afterValue = this.value;
                },
                _testTeardownAfter : function () {
                    impunit.assertEqual(this.value, 'initialized', 'setup namespace is broken')
                }
            };
            testImpUnit.runTests(testSuite);
            impunit.assertTrue(testImpUnit.testsFailed() == 0, testImpUnit.messages());
            impunit.assertEqual(beforeValue, 'initialized');
            impunit.assertEqual(afterValue, 'deleted');
        },

        _testSetupTeardownAsync : function () {
            var testImpUnit = getImpUnitTestInstance();
            var endValue = '';
            var testSuite = {
                _setup : function () {
                    this.track = 'start';
                },

                _teardown : function () {
                    this.track += '_end';
                    endValue = this.track;
                },

                _testAsyncTest : function () {
                    var context = this;
                    var asynchCallback = testImpUnit.asyncCallback(function () {
                        context.track += '_run';
                    });
                    setTimeout(asynchCallback, 100);
                }
            }
            testImpUnit.runTests(testSuite);
            impunit.assertEqual(testImpUnit.testsFailed(), 0, testImpUnit.messages());
            var asynchCallback = impunit.asyncCallback(function () {
                impunit.assertEqual(endValue, 'start_run_end', 'The setup, run, teardown does not work for async tests.');
            });
            setTimeout(asynchCallback, 200);
        },

        _testDuplicateNamesTeardown : function () {
            var teardown1Called = false;
            var teardown2Called = false;

            var testImpUnit = getImpUnitTestInstance();

            var testSuite1 = {
                _teardown : function () {
                    teardown1Called = true;
                },
                _testDoNothing : function () {
                    var asynchCallback = testImpUnit.asyncCallback(function () {
                        testImpUnit.assertTrue(true);
                    });
                    setTimeout(asynchCallback, 55);
                }
            };
            var testSuite2 = {
                _teardown : function () {
                    teardown2Called = true;
                },
                _testDoNothing : function () {
                    var asynchCallback = testImpUnit.asyncCallback(function () {
                        testImpUnit.assertTrue(true);
                    });
                    setTimeout(asynchCallback, 50);
                }
            }
            testImpUnit.runTests([testSuite1, testSuite2]);
            impunit.assertEqual(testImpUnit.testsFailed(), 0, testImpUnit.messages());

            var asyncCallback = impunit.asyncCallback(function () {
                impunit.assertTrue(teardown1Called, 'first teardown was not executed');
                impunit.assertTrue(teardown2Called, 'second teardown was not executed');
            });
            setTimeout(asyncCallback, 100);
        }

    };

    // run the tests
    impunit.onAsyncTestFailed(onAsyncCallbackFinished);
	impunit.runTests(testSuite);
    
    if (impunit.testsRun() <= 0) {
        alert('ERR: No tests were run!');
    } else {
        reportResult();
    }
};
