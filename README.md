## Git配置多账号

### 问题提出

公司项目一个git账号，在GitHub上也托管了自己项目，有自己账号。两边使用的账号是不同的对应的ssh key也不一样。
下面记录如何配置让git多账号在不同项目中自动无密码更新和提交：

git默认都是全局设置，比如：
1. 生成ssh key 可以用以下命令生成,不同项目起不同名字，如id_rsa_xxx
```
ssh-keygen -C "your_email" -t rsa -f id_rsa_xxx
```
输入文件名：id_rsa_xxx，回车；

2. 默认生成ssh_key，在用户.ssh文件夹中。
```
windows：C:\Users\用户名\.ssh
Linux：～/.ssh
```
其中id_rsa_xxx对应私钥，id_rsa_xxx.pub对应公钥，拷贝id_rsa_xxx.pub内容；

3. 打开github对应xxx项目，找到settings-Deploy keys添加一个，名字随便取，粘贴2步中拷贝内容，保存；公司的git仓库可以添加sshkeys
4. 接步骤2中目录，找到config文件。没有就新建一个，用文本编辑器打开，添加如下配置：
```
#git项目账号
Host xxxxx          #项目服务器名字，待会用到
HostName hostname   #项目检出hostname，对应项目根目录下.git/config中url值@与:之间内容，如"github.com"
User youname        #用户名
IdentityFile ~/.ssh/id_rsa_xxx #该项目ssh key 所在路径
```
5. 进入本地git项目根目录，打开.git/config文件，修改配置，效果如下：
```
[core]
        repositoryformatversion = 0
        filemode = false
        bare = false
        logallrefupdates = true
        symlinks = false
        ignorecase = true
        hideDotFiles = dotGitOnly
[remote "origin"]
        url = git@**xxxxx**:**/**.git
        fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
        remote = origin
        merge = refs/heads/master
[user]
        name = **you name**
        email = **you email**
```
添加了最后两行[user]对应内容，对以上**包括中内容进行修改，其中url后面xxxxx值是对应上一步中git配置的Host值（上面提到了："待会用到"，就在这儿用）
如果有必要可以执行取消全局设置的命令
```
git config --global --unset user.name
git config --global --unset user.email
```
注：也可以使用命令行完成配置。这里需要注意，使用.ssh目录下的host代替真实的hostname，这样才能让git识别出来

    git remote add first git@first:A/project.git
    
> 小总结：

1. 如果使用https协议，请在项目中配置用户名与邮箱即可；
2. 如果使用git协议，需要配置sshkey，过程就是 
    - 找到全局git配置目录，在其中修改或创建config文件，然后写入A、B...git服务器
    - 配置host及hostname等，最重要是IdentityFile( sshkey文件 )所在目录
    - 使用ssh-keygen -C "your_email" -t rsa 来生成公钥与私钥对应文件，指定文件名与config中一致
    - 如果使用github，可以去指定项目下，添加对应的xxx.pub文件中公钥
    - 在对应项目下配置.git/config指定在全局中配置的host的名字
    - 使用git协议即可；