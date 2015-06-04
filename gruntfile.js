module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>, built <%= grunt.template.today("yyyy-mm-dd") %> \nLicense: MIT\n' +
                    '(c) <%= grunt.template.today("yyyy") %>, Manuel Ruelke, homecoded.com \n */'
            },
            build: {
                src: 'src/js/impunit.js',
                dest: 'src/js/impunit.min.js'
            }
        },
        jshint: {
            src: [
                /* 3rd party scripts are not included here */
                'Gruntfile.js',
                'src/js/impunit.js',
                'src/js/tests.js'
            ],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                undef: true,
                browser: true,
                jquery: true,
                '-W099': true, /* switching off "W099: Mixed spaces and tabs." */
                globals: {
                    /* specify missing globals here, if any */
                    module: true,
                    alert: true
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load jshint
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'jshint']);

};