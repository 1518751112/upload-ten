# upload-ten-cli

## 简介
使用本工具可以使用脚本命令将文件上传到腾讯云对象储存服务器上

## 注意
需要配置好账号信息

## 安装
#### 全局安装 直接使用 upload-ten 命令
#### 项目安装 需要在命令前加上 npx 示例 npx upload-ten
```
npm install -g upload-ten-cli
```

## 使用
### 在需要上传的文件夹下创建一个 uploadTen.yml配置文件 然后执行命令
```
upload-ten
```
### 也可以指定配置文件
```
upload-ten ./uploadTen.yml
```

### 配置文件
``` yaml
secretId: "账号id"
secretKey: "账号key"
prefix: "上传到服务器的前缀/目录"
srcPath: "需要上传的文件目录"
region: "地域"
bucket: "储存桶名称"
enableLog: true #是否打印日志
```
