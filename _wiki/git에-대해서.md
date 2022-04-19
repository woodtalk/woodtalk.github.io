---
---
# git에 대한 잡다한 지식

## merge 와 rebase 의 차이점

- merge 는 branch 를 묶는 것
- rebase 는 branch 를 commit(or branch)에 얹는 것

## 유용한 정보

### .git/info/exclude 그리고 attributes

살다보면 플젝에 쪼랩으로 들어와 commit 하나가 살 떨릴 때가 있다.

`.gitignore` 가 이미 커밋되어 있어 내 개인적으로 쓰는 임시 파일들(예를 들면 swp라던지...ㅠㅠ)을 ignore 하고 싶은데,   
`.gitignore` 에 넣기 애매한 경우가 있다.

git은 정말 좋은 녀석이므로 이 부분을 해결하였는데,   
`.git/info` 폴더를 보면 `exclude` 파일이 있다.   
요 파일은 `.gitignore` 와 동일 효력을 같지만 push되지 않는 local 파일이다.

사용법도 `.gitignore` 와 같으니 잘 써먹어 보자.

자매품으로 `.gitattributes` 를 대체 할 `attributes` 파일도 있다.

### git 에서 clone 및 pull 에서 자꾸 `^M`(carriage returns)을 붙혀서 땡겨온다?

`.gitattributes` 에 다음을 넣어 커밋하자

```gitconfig
*.sh text eol=lf
```

### 이미 커밋되었어요. ignore 가 하고 싶어요.

git 명령어 중 안 알려진 명령어 `update-index`(`ls-files` 등)를 이용하자.   
간단한 사용예만 정리한다.

```bash
git ls-files -v | grep ^S
git update-index --skip-worktree <파일명>
git update-index --no-skip-worktree <파일명>
```

### author 나 committer 정보를 일괄적으로 변경하고 싶을 때

```bash
#!/bin/sh

git filter-branch --env-filter '

OLD_EMAIL="your-old-email@example.com"
CORRECT_NAME="Your Correct Name"
CORRECT_EMAIL="your-correct-email@example.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
  export GIT_COMMITTER_NAME="$CORRECT_NAME"
  export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
  export GIT_AUTHOR_NAME="$CORRECT_NAME"
  export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

참고 <https://help.github.com/en/articles/changing-author-info>

### git log alias(color highlight)

```bash
git config --global alias.lg "log --pretty=format:'%C(auto)%h %ai %Creset%C(auto,bold blue)<%an>%Creset%C(auto) -%d %s %Creset%C(auto,green)(%cr)%Creset' --graph --decorate --all"
```

- `--stat` : 변경 파일 목록 표기
- `-p` : 파일 변경 diff까지 보기
- `-{숫자}`(`-2`) : log 목록 제한

참고 <https://coderwall.com/p/euwpig/a-better-git-log>

#### git diff(log -p 옵션에서도 사용가능)에서 유용한 옵션

```bash
--word-diff
```

### 기타 추가하면 편한 alias

```bash
git config --global alias.s "status -s"
git config --global alias.df difftool
```

### vimdiff 단축키

[vim에 대해서](vim에 대해서) 의 vimdiff 단축키 참고

## git-svn

git-svn 은 svn 을 쓰는 프로젝트에 꿈과 같은 명령어라고 할 수 있다.   
다면 초기 설정이 그지 같아서 문제다.

`.git/config` 를 저장하여 유지를 시키면 안심   
git config 가 무엇인지 svn 은 어떻게 연결시키는 것이 덜 혼란스러운지 기타 잡 스킬에 대해 알아보자.

### git config

git 프로젝트?에 로컬적인 각종 설정파일   
여러 옵션들이 있지만 여기에서는 `[svn-remote "svn"]` 만 다루겠다.

### git-remote 하위 주요 옵션

- svn-remote 옆에 있는 `"svn"` 의미
  + 해당 string이 svn이면 `git svn fetch` 등에서 그냥 default로 생략 가능한 이름이다.
  + svn외 다른 이름을 쓰면 `git svn fetch somebody-help-me` 요런 식으로 쓸 수 있는데 `[svn-remote "somebody-help-me"]` 이 아래에 설정된 url 및 fetch 들만 실행된다.
- url
  + svn repo 의 url
  + url 만 쓰는게 (trunk 직전 path)만 쓰는 게 유리
- fetch
  + `git svn fetch` 명령으로 땡겨올 수 있는 path들
  + 여러개를 써도 된다.
- branches/tags
  + fetch 는 1:1 로만 쓸 수 있어 branch 를 fetch 로 적용할 경우 애로사항이 꽃핀다.
  + 때문에 branches(혹은 tags)가 있다.

자세한 사용법은 아래를 참고

```gitconfig
[svn-remote "svn"]
    url = http://localhost/svn
    # url은 trunk or branch 폴더 전까지 써주는 게 좋다.
    # 나중 refs 의 root 가 되는 위치이니 유념

    fetch = trunk/main-category/some-project:refs/remotes/svn/trunk
    # fetch 의 : 왼쪽은 url 다음 path 를 뜻함
    # fetch 의 : 오른쪽은 git 에서 쓸 branch path(와 name)을 뜻함
    # refs/remotes 는 원격지 branch 표시를 위한 prefix 라고 생각하면 편함

    fetch = branches/special/some-category/branch-name-1/main-category/some-project:refs/remotes/svn/branches/branche-name-1
    # 위 같이 쓰면 http://localhost/svn/branches/special/some-category/branch-name-1/main-category/some-project 를
    # git 의 remotes/svn/branches/branche-name-1 로 연결하여 관리하게 만듬
    # 때문에 branch-name-2 ...3 등등 있으면 다 써줘야하는데 문제가 심각함.

    branches = branches/*/*/main-category/some-project:refs/remotes/svn/branches/*/*
    # 요거 찾니라 겁나 시간 걸림
    # //사이에는(하나의 단어) * 는 한개만
    # git branch 위치 끝에는 무조건 * 찍어야함
    # * 표기를 차례로 git branch 에 매칭시켜줌. 오 갓
```

특히 branches 의 **규칙** 은 공식 홈페이지에서도 자세히 다룬다.   
<https://git-scm.com/docs/git-svn#_configuration> 에 언급되니 참고

### git-svn 으로 커밋들 땡겨올 때 author 의 email 주소가 hashing 이 붙어서 시무륵

`.git/config` 에 `svn.authorsProg` 라는 게 있다.

```gitconfig
[svn]
  authorsProg = .git/info/change-author-company-email.sh
```

아래는 `.git/info/change-author-company-email.sh` 파일 내용이다.   
`.git/info`에 해당 스크립트를 넣는 이유는 `exclude` 등 개인적인 옵션 파일들이 거기에 있어 ln(mklink) 등으로 별도로 관리하는 편이므로... 편의에 의해

```bash
echo "$1 <$1@gmail.com>"
```

추가적으로 `svn.authorsfile` 이라는 옵션도 있으니 참고 바람

### git-svn 주요 명령어

- `git svn fetch`
- `git svn dcommit`

말고는 쓰지도 보지도 말자

#### git svn fetch 에서 특정 리비전부터 땡기는 법

`git svn fetch -r1234:HEAD`

HEAD는 꼭 대문자로

### sparse checkout

git 으로 svn의 subdirectory checkout 을 하고 싶었다.   
정밀히는 안되지만 대충은 되는 방법이 있는데, git 버전이 올라가면 뭔가 되지 않을까 예상한다.   
현재 버전(2.25)에서는 여기까지인 것 같다.

`.git/config` 에 다음과 같은 설정을 추가하자

```gitconfig
[core]
  sparseCheckout = true
  # 아래 것은 효율을 올리고 패턴을 포기하는 건데 걍 해놓자
  sparseCheckoutCone = true
```

`.git/info/sparse-checkout` 에 받을(혹은 제외할) path 를 넣자

```gitconfig
/_wiki/
!/*
```

이런식인데, 반쪽짜리이다.

`sparse-checkout` 명령어도 따로 있는데 위의 과정을 자동으로 해주는 걸로   
`init`, `set` 명령이 있다.(`disable` 도 있다.)

참고는 다음 사이트에서 했다.   
<https://www.lesstif.com/pages/viewpage.action?pageId=20776761>   
<https://github.blog/2020-01-17-bring-your-monorepo-down-to-size-with-sparse-checkout/>

### worktree

현재(혹은 특정 commit 이나 branch)를 기반으로 새폴더에 작업트리(worktree)를 생성할 수 있는 기능이 있다.   
급한 상황 다른 작업 중에 현재 폴더는 그대로 나두고 hotfix를 뜨는 시나리오에서 사용할 만하다는데   
우선 공부는 해놔서 기록으로 남겨 놓는다.

개인적으로 cp를 스마트하게 한다는 점 외에 큰 장점을 못 느끼겠다.

`list`, `add`, `remove` 등 명령어가 있다.

worktree 별 config 를 설정할 수도 있는데,

`git config extensions.worktreeConfig true`   
`git config --worktree {설정 값}`   
이런 과정으로 사용할 수 있다.

`.git/config` 다음과 같이 들어가고

```gitconfig
[extensions]
  worktreeConfig = true
```

`.git/config.worktree` 파일이 생기고 다음과 같이 들어간다.

```gitconfig
[core]
  sparseCheckout = true
```

worktree 를 옮겨다니면서(cd 명령으로) 변경한 worktree에서 `git config --worktree` 를 쓰면   
그 worktree 에만 설정이 적용되는데, 순서는 다음과 같다.

`config.worktree` -> `.git/config`

그런데 이 기능도 잘 활용될지는 모르겠고, 우선 공부해 봤으니 기록용으로 남긴다.

### diff with vim

```bash
git difftool --no-prompt --tool vimdiff
```

```vim
:diffupdate
```

#### diff with gvim

```dos
git difftool --no-prompt --extcmd="'C:\Program Files\Vim\vim82\gvim' -d --nofork"
git difftool --no-prompt --tool gvimdiff
```

#### difftool and alias

```bash
git config --global diff.tool vimdiff
git config --global difftool.prompt false
```

### merge conflict with vim

```bash
git config --global merge.tool vimdiff
git config --global merge.conflictstyle diff3
git config --global mergetool.prompt false
```

```bash
git mergetool
```

```vimconfig
:diffget remote

:diffg RE  " get from REMOTE
:diffg BA  " get from BASE
:diffg LO  " get from LOCAL
```

[출처](https://www.rosipov.com/blog/use-vimdiff-as-git-mergetool/)

## git flow config 관련

`git flow` 를 쓰면 flow branch를 쉽게 관리할 수 있다.

git flow 의 최신 버전은 `1.12.3 (AVH Edition)` 이다(2020년 3월경)   
해당 버전은 `finish` 에서 merge 하는 방식이 변경되었는데,   
github의 토론 기록을 몇가지 봤는데 git-flow 를 제안한 사람이 룰을 좀 독단적으로 바꾸는 경향이 있는 것 같다.   
이 부분에 대한 내용은 이해한 대로 추후 기술하도록 하겠다.

여튼 기존 방식으로 flow 를 적용하려면 다음과 같은 옵션을 추가하면 된다.

```gitconfig
[gitflow "feature.finish"]
    no-ff = true
[gitflow "hotfix.finish"]
    nobackmerge = true
[gitflow "release.finish"]
    nobackmerge = true
```

아니면 다음 명령을 실행해주면 된다.

```bash
git config --global gitflow.feature.finish.no-ff true
git config --global gitflow.hotfix.finish.nobackmerge true
git config --global gitflow.release.finish.nobackmerge true
```

### git-flow 제안자([nvie](https://github.com/nvie))의 의견?

우선 영어가 짧은 관계로 해석에 오해가 있어 **잘못된 해석** 을 하였을 수 있으니   
이점 참고하길 바람

#### one commit feature branch

- `--ff` merge 로 진행해야한다고 판단
- 하나 짜리 커밋를 merge 할 경우 빈 merge 커밋이 생기는데, 불필요한 커밋 그래프 복잡성을 야기한다고 생각함
- 때문에 default feature finish 는 ff
- 관련된 정보는 다음 링크를 참고 <https://github.com/nvie/gitflow/issues/100#issuecomment-769968>
- avh 버전에서 project owner 의 관련 코멘트 <https://github.com/petervanderdoes/gitflow-avh/issues/140#issuecomment-68016681>

개인적으로 원 제안자의 의견이 좀 독단적인 부분이 있다고 생각 함   
코멘트 중 one commit feature branch 를 ff 로 merge 하면   
feature branch 가 담고 있는 이름이라는 정보가 사라짐   
나도 이 부분에 동의함

#### finish hotfix merge

- 참고 : <https://github.com/nvie/gitflow/issues/49>
- 처음 이해한 git-flow 의 흐름은
  1. hotfix 는 master 에서 생성
  2. 완료 시점에 hotfix 는 develop, master 로 각각 merge
  3. hotfix 삭제
- 변경된 버전은(혹은 avh 버전의 기본 동작 방식) - 이 코멘트 참고 <https://github.com/nvie/gitflow/issues/49#issuecomment-588258121>
  1. hotfix 는 master 에서 생성 - 여기까지는 동일
  2. 완료 시점에서 hotfix 는 master 에 merge
  3. merge 된 master 를 develop 에 merge
  4. hotfix 삭제
- 이유는 git-describe 에 친화적이지 않는 방식이라는데...

내 생각은 원안의 git-flow 흐름이 더 낫다고 판단   
git branch graph 를 볼 때 의도가 더 명확하다고 생각함   
개인적으로 변경된 버전에서의 이점은 만일 master 에만 적용된 commit 이 있을 경우   
hotfix 종료 시 develop 에 product 에 변경된 사항이 적용되므로   
이 경우를 생각하면 타당한 변경이라고 생각하는데,   
히스토리를 찾아보니 좀 뭔가 이유가 설득력이 없다고 생각됨

#### 정리

개인적으로 원 제안자의 처음 제안한 안이 더 괜찮다고 생각함   
그리고 원 제안자의 추후 git-flow 의 룰을 변경한 부분은 한번에 찾기 어려우며   
버저닝되지도 않았음   
또한 git flow 라는 툴은 업데이트가 안되어 있음   
현재는 avh 라는 이름이 정식 버전으로 취급되고 있음   
하지만 avh 버전도 legacy 라는 명목으로 기본은 원 제작자의 변경한 룰(어디에서도 설명이 명확하게 없는)을 기본으로 잡음   
[#git flow config 관련](#git-flow-config-관련) 을 참고하면 원안 룰 방식의 git-flow를 사용할 수 있음
