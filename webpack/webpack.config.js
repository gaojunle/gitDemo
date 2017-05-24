/**
 * @author  Administrator on 2017/5/14
 *
 * @descript
 * @version 1.0
 * @example:
 */
module.exports = {
    devtool: 'eval-source-map',
    entry: {
        index: './js/page/index.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        publicPath: '/dist/'        // 线上发布路径，和path最好保持一致，html页面引入script路径
    }/*,
     devServer: {
     contentBase: "./dist",    //本地服务器所加载的页面所在的目录
     colors: true,//终端中输出结果为彩色
     historyApiFallback: true,//不跳转
     inline: true//实时刷新
     }*/
}