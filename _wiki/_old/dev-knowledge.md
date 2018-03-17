# 환경 설정
windows라면 아래의 명령을 입력한다.

```bat
mklink %userprofile%\_vimrc %userprofile%\git-workspace\config-for-dev\vimrc
REM git clone된 쪽이 %userproflie%\git-workspace 라 가정
```

vim 에서 vundle이라는 plugin manager를 사용한다.
이것에 대한 정보는 http://github.com/gmarik/vundle 에서 확인해보자.

vundle **윈도우**에서 써보자
git은 당연히 깔린 상태여야 한다.
그리고 왠지 path에 등록해야할 꺼 같다.
https://github.com/gmarik/Vundle.vim/wiki/vundle-for-windows
여기에 설정하는 것이 있는데, windows에는 .vim 폴더가 없어서 거기에 대한 보완책이 있는 것 같다.

```bat
git clone https://github.com/gmarik/Vundle.vim.git %USERPROFILE%/.vim/bundle/Vundle.vim
```

## linux(**ubuntu**)라면 vim 및 git을 최신으로 까는 법
```bash
sudo apt-add-repository ppa:git-core/ppa
sudo apt-add-repository ppa:jonathonf/vim
sudo apt update
sudo apt install git vim
```

git completion을 위해서 ~/.bashrc 에 맨 아래 다음을 넣어주자
```bash
echo 'source ~/git-workspace/config-for-dev/bashrc-my-options' >> ~/.bashrc
```
## ubuntu terminal에 다양한 input 관련 신나는 노래
```bash
if [ ! -a ~/.inputrc ]; then echo '$include /etc/inputrc' > ~/.inputrc; fi
echo '$include ~/git-workspace/config-for-dev/inputrc-my-options' >> ~/.inputrc
```
사실 아래는 참고용 이므로 스킵해도 무방

### ubuntu에 terminal 자동 완성에서 대소문자 구분 끔(no case-insensitive)하려면
```bash
# If ~./inputrc doesn't exist yet, first include the original /etc/inputrc so we don't override it
if [ ! -a ~/.inputrc ]; then echo '$include /etc/inputrc' > ~/.inputrc; fi

# Add option to ~/.inputrc to enable case-insensitive tab completion
echo 'set completion-ignore-case on' >> ~/.inputrc
```
위를 terminal에서 입력하면 `~/.inputrc`가 생기는데 `/etc/inputrc`를 기본 베이스로 하여 옵션만 추가하므로 **안심**

출처 https://askubuntu.com/questions/87061/can-i-make-tab-auto-completion-case-insensitive-in-the-terminal

------------------------------------------------

# vi 단축키 관련
## insert mode에서...
* ctrl + [ 은 esc
* ctrl + h 은 backspace
* ctrl + w 은 이전 단어 지우기


## 그냥 모드에서 insert mode로 전환하는 다양한 방법
* i : 현재 커서에서 insert
* a : 현재 커서 다음 글자에서 insert
* I : 줄 앞단에서 insert
* A : 줄 맨 끝에서 insert
* o : 현재 커서의 아래 쪽에 줄 추가 후 insert
* O : 현재 커서의 윗 쪽에 줄 추가 후 insert


## 빨리 이동하기 위한 팁
* f문자 : 문자의 위치로 이동 ; 를 누르면 계속 이동
* F문자 : 백워드로 문자의 위치로 이동
* e or w : 단어 단위 앞으로 이동
* b : 단어 단위 뒤로 이동
* t문자 : 문자의 앞위치로 이동
* T문자 : 백워드방향으로 문자의 앞위치로 이동

## clipboard / registers 관련 팁
* `"{$character}y` : {$character}에 clipboard에 저장함
* `"{$character}p` : {$character}에 clipboard에 저장된 값 paste
* 명령어 모드에서 `:reg`는 현재 등록(regist)된 모든 clipboard 값을 확인할 수 있음


## 만약에 binary로 파일을 보고 싶으면

```vim
:%!xxd
```

다시 reverse하려면(되돌리려면)

```vim
:%!xxd -r
```

추가로 `setlocal binary`나 `setlcoal diplay=uhex` , `setlocal wrap` 기타 등등이 있는데 자세한 건 http://vim.wikia.com/wiki/Hex_dump 참조


## 인코딩이 변경하고 싶다

```vim
:e ++enc=\현재 파일 encoding\
:w ++enc=\변경할 파일 encoding\
```

현재 파일의 인코딩 확인은


```vim
set fenc
```

vim에서 파일을 읽을 때 인코딩 우선순위 설정 및 확인은

```vim
set fileencoings
```

추가로

```vim
:set bomb
:set nobomb
```

위의 명령으로 BOM을 추가 제거할 수 있다.


## JSON pretty formatting

```vim
:%!python -m json.tool
```

추가로 현재 특정 파일로 syntax변경하여 보고 싶으면

```vim
:set syntax=json
```

## `^M`(carriage returns)을 확인하고 싶다?

```vim
:e ++ff=unix
:e ++fileformat=unix
```

## `^M`(carriage returns)을 제거하고 싶다?

```vim
:%s/^M//g
:%s/{ctrl+v}{ctrl+m}//g
```

## PO **매크로** WER
* vim을 사용하려고 열시미 노력한지 어언 2년 쯤 드디어 매크로의 세계에 첫발을 디딘다.
* `q[매크로 명]` 이렇게 하면 레코딩이 시작된다.
  * 예를 들어 `qa`라고 했으면 a로 매크로가 기록되기 시작한다.
* 레코딩 중인 매크로를 끝마치려면 `q`로 끝마친다.
* 매크로 중 숫자를 증감 시키려면 숫자에 커서를 위치 시킨 후 `ctrl + a`(증가), `ctrl + x`(감소)를 누르면 된다.
  * 단, 커서를 이동 시킬 때 f나 /로 숫자를 찾지 말자 (숫자 값이 변경되지 않나)
* 매크로를 저장 했으면 매크로를 실행하려고 하는 위치에 커서를 잘 놓고 `@[매크로 명]`을 누르면 된다.
  * `qa`로 저장했다면 `@a`
* 매크로를 여러번 실행하고 싶으면 `[횟수]@[매크로 명]`같이 입력해 주면 됨
* http://forcecore.tistory.com/1255 는 매크로를 아예 저장하는 방법이 있네

## 대소문자 관련해서
* 선택 범위 모두 대문자 : U
* 선택 범위 모두 소문자 : u
* 선택 범위 모두 대소문자 반전 : ~
* 찾기 바꾸기에서 특정 문자 대문자로 : `\U\1\E`
* 찾기 바꾸기에서 특정 문자 소문자로 : `\L\1\E`


## 기타

ctrl + v 를 할 경우 수평 선택이 가능하다.
I는 그 상태에서 입력 가능 입력한 후 esc를 누르면 수평 입력이 가능하다.

visual mode에서 복사(y)한 내용을 search mode(/)에서 사용하는 방법은 ctrl + r + 0를 하면 된다.
ctrl + r에는 기타 다른 것도 사용할 수 있다. % # / : 등등
기타 자세한 내용은 :help c_CTRL-R로 알 수 있다.
출처 : http://seorenn.blogspot.kr/2011/04/vim.html?m=1


# git

git에서 clone 및 pull에서 자꾸 `^M`(carriage returns)을 붙혀서 배포한다?
`.gitattributes`에 다음을 넣어 커밋하자

`
*.sh text eol=lf
`

## merge와 rebase의 차이점
* merge는 branch를 묶는 것
* rebase는 branch를 commit(or branch)에 얹는 것

# svn

## svn의 모든 ignore 얻는 법
```bash
svn propget -R svn:ignore . > ignore-list.txt
svn propget -R svn:global-ignores . >> ignore-list.txt
```

## svn:ignore list(파일 형식)을 일괄 적용하는 방법
```
*.class
*.jar
*.war
```

위의 같이 ignore list(디렉토리는 안됨)가 txt파일로 존재한다고 가정
* svn의 ignore는 폴더 이름(혹은 패턴)을 적용할 수 없다

```bash
svn propset svn:global-ignores -F svn-ignore.txt .
# 특정 폴더만이면
svn propset svn:ignore -F svn-ignore.txt .
```

## windows에서 svn command line으로 unresolved/missing을 delete/add로 바꾸기
```bat
for /f "usebackq tokens=1*" %a in (`svn status`) do (if "%a"=="!" (svn delete "%b") else (if "%a"=="?" (svn add "%b")))
```

# 키타 유용한 명령(windows버전)
## svn revision 뽑기
```bat
rem &&은 왼쪽 명령이 0(성공)일 때만 오른쪽 명령을 수행
rem https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/ntcmds_shelloverview.mspx?mfr=true
set LC_MESSAGES=C && for /f "tokens=2" %%i in ('svn info ^| find "Revision"') do set rev=%%i
```

## json(1depth) 특정 value(string type) 뽑기
```bat
for /f "tokens=2" %%i in ('type test.json ^| find "deploymentId"') do set deploymentId=%%i
set deploymentId=%deployment:~1:-1%
```

# git-svn
git-svn은 svn을 쓰는 프로젝트에 꿈과 같은 명령어라고 할 수 있다.
다면 초기 설정이 그지 같아서 문제다.

`.git/config`를 저장하여 유지를 시키면 안심
git config가 무엇인지 svn은 어떻게 연결시키는 것이 덜 혼란스러운지 기타 잡 스킬에 대해 알아보자.

## git config
git 프로젝트?에 로컬적인 각종 설정파일

여러 옵션들이 있지만 여기에서는 `[svn-remote "svn"]`만 다루겠다.

## git-remote 하위 주요 옵션
* svn-remote 옆에 있는 `"svn"`의미
  * 해당 string이 svn이면 `git svn fetch` 등에서 그냥 default로 생략 가능한 이름이다.
  * svn외 다른 이름을 쓰면 `git svn fetch somebody-help-me` 요런 식으로 쓸 수 있는데 `[svn-remote "somebody-help-me"]`이 아래에 설정된 url 및 fetch들만 실행된다.
* url
  * svn repo의 url
  * url만 쓰는게 (trunk 직전 path)만 쓰는 게 유리
* fetch
  * `git svn fetch` 명령으로 땡겨올 수 있는 path들
  * 여러개를 써도 된다.
* branches/tags
  * fetch는 1:1로만 쓸 수 있어 branch를 fetch로 적용할 경우 애로사항이 꽃핀다.
  * 때문에 branches(혹은 tags)가 있다.

자세한 사용법은 아래를 참고

```gitconfig
[svn-remote "svn"]
	url = http://localhost/svn
	#url은 trunk or branch 폴더 전까지 써주는 게 좋다.
	#나중 refs의 root가 되는 위치이니 유념

	fetch = trunk/main-category/some-project:refs/remotes/svn/trunk
	# fetch의 : 왼쪽은 url다음 path를 뜻함
	# fetch의 : 오른쪽은 git에서 쓸 branch path(와 name)을 뜻함
	# refs/remotes는 원격지 branch 표시를 위한 prefix라고 생각하면 편함

	fetch = branches/special/some-category/branch-name-1/main-category/some-project:refs/remotes/svn/branches/branche-name-1
	# 위 같이 쓰면 http://localhost/svn/branches/special/some-category/branch-name-1/main-category/some-project 를
	# git의 remotes/svn/branches/branche-name-1 로 연결하여 관리하게 만듬
	# 때문에 branch-name-2 ...3 등등 있으면 다 써줘야하는데 문제가 심각함.

	branches = branches/*/*/main-category/some-project:refs/remotes/svn/branches/*/*
	# 요거 찾니라 겁나 시간 걸림
	# //사이에는(하나의 단어) *는 한개만
	# git branch 위치 끝에는 무조건 * 찍어야함
	# * 표기를 차례로 git branch에 매칭시켜줌. 오 갓
```

특히 branches의 **규칙**은 공식 홈페이지에서도 자세히 다룬다.
https://git-scm.com/docs/git-svn 에 CONFIGURATION 항목에 보면 언급되니 참고

## .git/info/exclude 그리고 attributes
살다보면 플젝에 쪼랩으로 들어와 commit 하나가 살 떨릴 때가 있다.

`.gitignore`가 이미 커밋되어 있어 내 개인적으로 쓰는 임시 파일들(예를 들면 swp라던지...ㅠㅠ)을 ignore하고 싶은데,
`.gitignore`에 넣기 애매한 경우가 있다.

git은 정말 좋은 녀석이므로 이 부분을 해결하였는데,

`.git/info` 폴더를 보면 `exclude`파일이 있다.
요 파일은 `.gitignore`와 동일 효력을 같지만 push되지 않는 local 파일이다.

사용법도 `.gitignore`와 같으니 잘 써먹어 보자.

자매품으로 `.gitattributes`를 대체 할 `attributes` 파일도 있다.

## git-svn으로 커밋들 땡겨올 때 author의 email 주소가 hashing이 붙어서 시무륵
`.git/config`에 `svn.authorsProg`라는 게 있다.

```gitconfig
[svn]
  authorsProg = .git/info/change-author-company-email.sh
```

아래는 `.git/info/change-author-company-email.sh` 파일 내용이다.
`.git/info`에 해당 스크립트를 넣는 이유는 `exclude` 등 개인적인 옵션 파일들이 거기에 있어 ln(mklink) 등으로 별도로 관리하는 편이므로... 편의에 의해
```bash
echo "$1 <$1@gmail.com>"
```
추가적으로 `svn.authorsfile`이라는 옵션도 있으니 참고바람

## git-svn 주요 명령어
* `git svn fetch`
* `git svn dcommit`

말고는 쓰지도 보지도 말자

### git svn fetch 에서 특정 리비전부터 땡기는 법
`git svn fetch -r1234:HEAD`

HEAD는 꼭 대문자로


------------------------------------------------
# OLD & MAC Setup

당연히 git이 깔린 상태여야 한다.
mac os 위주의 설정이다.(특히 vim)
reg 파일은 윈도우에서 실행하는 파일이다.

mac에서는 brew로 어플리케이션을 관리한다.
http://brew.sh 참고

brew로 제일 처음 할 일은 git을 설치하는 일
그리고 해당 git 프로젝트를 clone한 후
git clone https://github.com/woodtalk/config-for-dev

mac이라면 아래의 명령을 입력한다.

```bash
ln -s ~/git-workspace/config-for-dev/bash_profile ~/.bash_profile
ln -s ~/git-workspace/config-for-dev/vimrc ~/.vimrc
```

vim의 경우 예전에는 macvim이라는 것을 써야 했는데
현재는 vim을 설치하여도 최신 버전의 vim이 설치되는 것 같다.

```bash
brew install vim
```

vim으로 실행하면 새로 설치된 vim이 실행되는데, vi는 예전의 vim이 실행된다.
그 이유는 명령어 연결 부분인데 그 처리는 아래와 같이 해결했다.
```bash
# ~/.bash_profile 에 아래를 추가하여 해결
alias vi='vim'
```

```bash
which vim
which vi
```

를 실행하면 이유를 알 수 있다.

맥에서 터미널에서 vim에서 esc로 영어로 빠져나올라면 아래의 과정을 거쳐야하고 그리고 같이 커밋된 vimrc 파일을 확인해보면 됩니다.

```bash
git clone https://github.com/vovkasm/input-source-switcher.git
cd input-source-switcher
mkdir build
cd build
cmake ..
make
make install
```
출처 : https://sangwook.github.io/2015/01/01/vim-insert-mode-keyboard-switch

# msgenny (aka. mscgen_js)
* https://mscgen.js.org/embed.html
* https://mscgen.js.org/tutorial.html

```html
<!-- packet-flow-chart.html -->
<html>
	<head>
		<script src="https://sverweij.github.io/mscgen_js/mscgen-inpage.js" defer></script>
		<script>
var mscgen_js_config = {
	loadFromSrcAttribute: true
};
		</script>
	</head>
	<body>
		<!-- https://mscgen.js.org/embed.html -->
		<pre	class='mscgen_js'
				data-src="./packet-flow-chart.msgenny"
				data-named-style='fountainpen'
				data-language='msgenny'>
		</pre>
	</body>
</html>
```

```msgenny
# vim: set syntax=msgenny:
# packet-flow-chart.msgenny
# see https://mscgen.js.org/tutorial.html
u : User,
c : Computer;

u -> c : press a key;
...;
```
