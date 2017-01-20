module.exports = function (grunt) {

    require('time-grunt')(grunt);

    // load all grunt tasks
    require('jit-grunt')(grunt);

    grunt.initConfig({

        // Clean dist folder (all except lib folder)
        clean: {
            js: ["dist/css","dist/js/.baseDir*","dist/js/*", "!dist/js/libs/**",  "dist/index.html"],
            dist: ["dist/js/*", "!dist/js/index.js", "!dist/js/babylon.2.5.js", "!dist/js/libs/**"]
        },

        // Compilation from TypeScript to ES3
        ts: {
            options: {
                compiler: '/usr/bin/tsc'
            },    
            dev: {
                src : ['src/**/*.ts'],
                outDir: "dist/js",
                options:{
                    module: 'system',
                    target: 'es5',
                    declaration: false,
                    sourceMap:true,
                    removeComments:false,
                    strictNullChecks: true
                }
            },
            dist: {
                src : ['src/**/*.ts'],
                outDir: "dist/js",
                options:{
                    module: 'system',
                    target: 'es5',
                    declaration: false,
                    sourceMap:false,
                    removeComments:true,
                    strictNullChecks: true
                }
            }
        },
        // Watches content related changes
        watch : {
            js : {
                files: ['src/**/*.ts'],
                tasks: ['ts:dev']
            },
            sass : {
                files: ['sass/**/*.sass'],
                tasks: ['sass','postcss:debug']
            },
            // pug: {
            //     files: ['html/**/*.jade'],
            //     tasks: ['pug']
            // },
            html : {
                files: ['html/**/*.html'],
                tasks: ['bake']
            }
        },
        // HTML minifier
        htmlmin : {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist/index.html'
                }
            }
        },
        // Build dist version
        uglify : {
            dist: {
                options: {
                    compress:true,
                    beautify: false
                },
                files: {
                    'dist/js/index.js': ['dist/js/**/*.js', '!dist/js/libs/**/*.js']
                }
            }
        },
        // Sass compilation. Produce an extended css file in css folder
        sass : {
            options: {
                sourcemap:'none',
                style: 'expanded'
            },
            dist : {
                files: {
                    'dist/css/hack.css': 'sass/hack.sass'
                }
            }
        },
        // Auto prefixer css
        postcss : {
            debug : {
                options: {
                    processors: [
                        require('autoprefixer')({browsers: 'last 2 versions'})
                    ]
                },
                src: 'dist/css/hack.css'
            },
            dist: {
                options: {
                    processors: [
                        require('autoprefixer')({browsers: 'last 2 versions'}),
                        require('cssnano')()
                    ]
                },
                src: 'dist/css/hack.css'
            }
        },
        pug: {
            compile: {
                options: {
                    client: false,
                    pretty: true
                },
                files: [
                    {
                        'html/index.html': ['html/index.jade']
                    },
                    {
                        // src: 'html/*.jade',
                        // dest: 'dist',
                    }
                ]
            }
        },
        // Bake HTML file (link includes in the main html file)
        bake : {
            index: {
                files: {
                    'dist/index.html': "html/index.html"
                }
            }
        },

        //Server creation
        connect: {
            server: {
                options: {
                    port: 3002,
                    base: '.'
                }
            },
            test: {
                options: {
                    port: 3002,
                    base: '.',
                    keepalive:true
                }
            }
        },
        // Open default browser
        open: {
            local: {
                path: 'http://localhost:3002/dist'
            }
        }
    });

    grunt.registerTask('default', 'Compile and watch source files', [
        'dev',
        'connect:server',
        'open',
        'watch'
    ]);

    grunt.registerTask('run', 'Run the webserver and watch files', [
        'connect:server',
        'open',
        'watch'
    ]);

    grunt.registerTask('dev', 'build dev version', [
        'clean:js',
        'ts:dev',
        'sass',
        'postcss:debug',
        'pug',
        'bake'
    ]);

    grunt.registerTask('test', 'test dist version', [
        'open',
        'connect:test'
    ]);

    grunt.registerTask('dist', 'build dist version', [
        'clean:js',
        'ts:dist',
        'sass',
        'postcss:dist',
        'pug',
        'bake',
        'htmlmin',      // minify html
        'uglify',       // compile js files in index.js
        'clean:dist'    // remove js file
    ]);

};


