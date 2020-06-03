# Todoアプリを作りながらTDDを学ぼう - APIサーバ編 -

TDDがいいとかみんな言うんだけど、ちゃんとTDDをゼロから勉強できる素材がなかなかないなー、という今日この頃だったので、Jestの勉強がてらTodoアプリを題材にTDDで作るとこうなりました的なやつを初心者向けに作れないかなと思いなんとなく作っているものです（2020年5月現在、未完成）


### 現在利用可能な機能

・Todo に関する基本的なCRUD操作  
・ユーザのサインアップとログイン（ユーザ単位でのTodoデータの管理制御はまだ)  
・なんとなくノリで Dockerfile もつけてみたなど（主に会社で実験するときとか用途を想定)  

## 依存関係:

    Node.js ：12以降
    MongoDB : Cloud MongoDB等の利用を想定
    その他については package.json 参照のこと


# 利用手順

### Tested System:
* windows10が動くそこらへんのPC

### 通常の利用方法
1. APIサーバの起動

```bash:
npm run start
```


## 参考文献

### 参考リンク

・ Nodejs Express TDD course with Jest on Udemy
https://github.com/Hyllesen/express-tdd