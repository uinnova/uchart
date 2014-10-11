module.exports = function(grunt){

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),

        concat : {
            uportal : {
                files : {
                    'dist/uchart.debug.js':['./js/ucommon.js','./js/number.js','./js/bar.js','./js/uradar_basic.js','./js/ubar_basic.js','./js/uline_basic.js','./js/upie_basic.js','./js/upie_mxprocess.js','./js/upie_precess.js','./js/uarea_basic.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default',['concat']);

}