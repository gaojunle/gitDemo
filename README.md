## Git配置多账号

### 问题提出

－背景：公司项目git账号，在GitHub上有个人项目git账号。下面记录如何配置让git多账号多项目中自动无密码更新和提交：

1. 进入~/.ssh目录，使用如下命令生成ssh key,不同项目对应不同key文件名，如id_rsa_xxx
```
ssh-keygen -C "your_email" -t rsa -f id_rsa_xxx
```
可保存一个keygen.sh文件，使用sh动态生成，内容如下：
```
#!/bin/sh
#配置多账号

echo -e 'please input you email'
read email
echo -e 'please input you file name, like: id_rsa_xxx'
read filename
ssh-keygen -C $email -t rsa -t rsa -f $filename
```

2. 默认生成ssh_key，在用户.ssh文件夹中。
```
windows：C:\Users\用户名\.ssh
Linux：～/.ssh
```
其中id_rsa_xxx对应私钥，id_rsa_xxx.pub对应公钥，拷贝id_rsa_xxx.pub内容；

3. git仓库sshkey配置
   打开github对应xxx项目，找到settings-Deploy keys添加一个，名字随便取，
   粘贴2步中拷贝内容，保存；公司的git仓库可以添加sshkeys
   
4. 接步骤2中目录，找到config文件。没有就新建一个，用文本编辑器打开，添加如下配置：
```
#git项目账号
Host xxxxx          #项目名字，任意字符，第5步会用到
HostName hostname   #项目检出hostname，对应项目根目录下.git/config中url值@与:之间内容，如"github.com"
User yourname       #用户名
IdentityFile ~/.ssh/id_rsa_xxx #该项目ssh key 所在路径

#示例如下：
Host gitapp
HostName github.com
User gaojunle
IdentityFile ~/.ssh/id_rsa_gitapp

```
5. 如果你已经使用https方式clone了项目，进入项目根目录，打开.git/config文件，修改配置，效果如下：
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
        url = git@**gitapp**:**/**.git #此处为第4步中Host
        fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
        remote = origin
        merge = refs/heads/master
[user]
        name = **you name**
        email = **you email**
```
其中url后面xxxxx值是对应4步中Host值（上面提到了："待会用到"，就在这儿用）
如果有必要可以执行取消全局设置的命令
```
git config --global --unset you name
git config --global --unset you email
```
