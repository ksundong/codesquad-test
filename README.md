# codesquad-test

2020년도 마스터즈 코스 테스트 수행용 git repository  
가상 야구 게임의 점수판을 구현한다.  
각 단계별로 구현한 코드 동작에 대해 README.md에 정리한다.

## Step 1

1. 게임이 시작되면 "첫 번째 타자가 타석에 입장했습니다." 메시지와 함께 경기를 진행한다.  
   start라는 이름의 function을 선언하여 start가 실행되었을 때, 메시지를 출력하고 경기를 진행한다.  
   경기를 진행하는 것도 함수로 처리하는 편이 좋을 것 같아 playgame이라는 함수를 만들어 주었다.

2. 경기가 진행되면 랜덤하게 스트라이크 / 볼 / 안타 / 아웃 네 가지 중 한 결과가 출력된다.  
   playgame 함수가 실행되었을 때, randomResult라는 위의 네 가지 중 한 결과를 출력하는 함수를 만들었다.  
   출력 예시를 참고하여, 신나는 야구 게임!을 최초에 출력하도록 수정하였다.

3. 2번의 결과의 아래 줄에 누적된 스트라이크(S), 볼(B), 아웃(O) 상황을 출력한다.  
   상태를 관리하기 위해 status라는 객체를 생성하였다. toString 메소드로 상태를 출력한다.  
   난수의 값에 따라 상태를 업데이트 하는 updateStatus함수를 추가하였다.  
   난수를 변수로 두고 result 변수를 제거하였다.

4. 스트라이크가 3회 누적되면 1 아웃이다.  
   status업데이트 후 체크하는 checkStatus 함수를 생성하였다.  
   S가 3일 경우, 0으로 초기화하고, Out(O)의 개수를 높이도록 하였다.

5. 볼이 4회 누적되면 1 안타가 된다.  
   4번과 같이 checkStatus 함수 내에서 처리하였다.  
   B가 4일 경우, 0으로 초기화하고, H의 개수를 높이도록 하였다.

6. 4와 5의 경우를 포함한 안타 또는 아웃의 경우 "다음 타자가 타석에 입장했습니다." 메시지와 함께 경기가 이어진다.  
   status에 isBatterOut이라는 타자가 아웃되었는지 여부를 확인하는 변수를 추가하였고, 이는 아웃과 안타시에만 조정이 되기 때문에 메소드에서 처리하는 것으로 수정하였습니다.  
   그리고 출력 예시를 참고하여 checkStatus 함수를 수행하기 이전에 먼저 결과 출력 후 checkStatus 함수를 수행하고, 각각의 결과에 출력을 시키도록 하였습니다.  
   changeBatter 메소드는 isBatterOut의 상태를 false로 바꾸고, 메시지를 반환하도록 하였습니다.

7. 다음 타자의 차례에서 현재의 안타, 아웃카운트는 유지되고, 스트라이크와 볼 카운트는 초기화된다.
   changeBatter 메소드 수행시 스트라이크와 볼 카운트를 초기화하도록 코드를 추가하였습니다.

8. 3 아웃이 될 경우 전체 안타수를 출력하고 경기가 종료된다.  
   while 반복문으로 Loop 중 아웃 카운트가 3이 되면 종료하도록 하였습니다.  
   이후 gameOver 메소드를 추가하여 최종 메시지를 출력하도록 하였습니다.  
   출력 예시와 동일하도록 changeBatter 메소드 수행중 아웃 카운트가 3일 때에는 빈 메시지를 반환하도록 하였습니다.

리팩토링.

1. 중첩된 console.log문 제거

2. status의 속성인 S, B, O, H를 일반적인 변수명 규칙에 맞도록 수정하였습니다.

3. 상태를 업데이트 하는 updateStatus와 checkStatus를 하나의 기능으로 합쳤습니다.  
   switch case문을 이용한 재귀를 이용하여 합쳤습니다.  
   각각의 기능을 메소드로 만들어서 간단하게 만들었습니다.  
   changeBatter가 카운트를 초기화하는 역할을 하도록 수정하였습니다.

4. playgame이라는 함수를 status의 메소드로 수정하였습니다.

5. status라는 변수명이 직관적이지 않아서 game으로 바꾸었습니다.  
   내부 메소드 명칭도 playGame에서 play로, gameOver에서 over로 변경하였습니다.

6. log를 남기는 toString 메소드를 log라는 명칭으로 바꾸었습니다.

7. start 함수를 main으로 바꾸었습니다.

8. 객체 내부의 순서를 main함수에서 호출하는 순서대로 보기좋게 하기위해 수정하였습니다.

9. 클린코딩 원칙에 따라 update 메소드에서 switch case문으로 return하는 방식 대신 if else문으로 변경하였습니다.

## Step 2

### 2단계 요구사항 1: 팀데이터 입력 및 저장

1. 2단계 클린코딩을 적용하였습니다.  
   전역변수를 최소화 하기 위해 main 함수 안으로 game 객체를 이동하였습니다.  
   update 메소드의 if else문의 깊이가 깊어져서 간단하게 수정하였습니다.

2. 팀과 선수 데이터를 입력받을 클래스를 선언하였습니다.  
   이 때, 투수가 존재한다고 하였으나, 실제 예시에서 입력하는 부분이 존재하지 않아,의도적으로 Player 클래스가 타자의 역할을 하도록 작성하였습니다.

3. 사용자의 입력을 받는 readline 모듈을 넣었고, selectMenu 메소드를 선언하였습니다  
   selectMenu 메소드는 입력값에 따라 데이터를 입력하는 enterData 메소드와 출력하는 printData 메소드로 분기되게 처리하였습니다.

4. readline 모듈이 많은 indent를 필요로 하여 readline-sync로 변경하였습니다.  
   이로 인해 gitignore 파일을 추가하였고 node_modules를 무시하도록 설정하였습니다.  
   실행 전 `npm i` 를 꼭 입력해주어야 합니다.

5. class의 위치를 전역으로 변경하였습니다.

6. Team 클래스에 player를 담을 players 배열을 선언하였습니다.  
   또, addPlayer 메소드를 추가하여 player를 입력받도록 하였습니다.

7. game 객체 안에 firstTeam과 secondTeam을 선언해주었습니다.  
   이곳에 enterData 메소드를 통해 정보를 입력받도록 하였습니다.

8. 무한루프를 사용하여 사용자의 입력을 계속 받을 수 있도록 하였습니다.  
   이후 데이터 출력후에 루프가 종료되게 수정하도록 하겠습니다.

9. 저장된 데이터를 출력하는 printData 메소드를 추가하였습니다.  
   또, printData 메소드 수해 후 종료하도록 수정하였습니다.

10. addPlayer 메소드의 명칭을 addPlayers로 변경하고 반복되는 부분을 addPlayer라는 메소드로 분리하였습니다.

11. addPlayer에서 잘못된 값이 입력되었을 경우 다시 입력받을 수 있도록 무한루프 처리를 하였습니다.  
    검증하는 부분을 메소드화 하였고 불린값을 리턴하도록 선언하였습니다.

12. addPlayer의 매개변수의 이름을 유의미하게 변경하였습니다.

13. Team이 존재하는지 확인하는 check 메소드를 생성하였습니다.

14. printData시 사전에 데이터가 입력되지 않으면 먼저 입력하라는 메시지가 출력되도록 하였습니다.

15. Team 이름을 입력받는 메소드인 enterTeamName을 분리하고,  
    팀 이름을 입력하지 않았다면 입력해달라는 메시지를 출력하도록 수정하였습니다.

16. game객체를 main함수 밖으로 이동하였습니다.

### 2단계 요구사항 2: 시합하기 기능 구현

1. 시합을 시작하는 기능을 추가하였습니다. 종료시 over 메소드를 호출하도록 변경하였습니다.

## Step 3
