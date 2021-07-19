import { LightningElement,track } from 'lwc';

export default class Sudoku extends LightningElement {

    renderComplete = false;
		gameBlock;
		tempArray = [];
		totalHints = 3;
		@track gameBlockToShow;
		isGameCompleted = false;
		
		connectedCallback(){
				console.log('COnnected callback');
				this.template.addEventListener('onkeyup', evt => {
						console.log('Notification event', evt);
				});
		}		
		
		renderedCallback(){
			if(!this.renderComplete){
				this.renderComplete = true;
				this.setGameBlock();
				this.addKeyBoardEvent();
			}
		}
		
		addKeyBoardEvent(){
				window.addEventListener('keydown',(e) => {
						e.preventDefault();
						if(!isNaN(e.key)){
								if(parseInt(e.key) >= 0 && parseInt(e.key) <= 9)
										  this.addNumberInBoard(e.key);
						}
				})
		}
		
		setGameBlock(){
				
				this.isGameCompleted = false;
				this.tempArray = new Array(9);
				for(let i = 0; i < 9; i++)
						this.tempArray[i] = i+1;
				this.tempArray = this.shuffle(this.tempArray);
				this.gameBlock = new Array(9);
				
				for(let i = 0; i < 9; i++ ){
						this.gameBlock[i] = new Array(9);
				}
				
				this.createSudokuBoardByArray();
				
				console.log('-----after shuffle------');
				this.shuffleBoard();
				
				for(let i = 0; i < 9; i++){
						let res = '';
						for(let j = 0; j < 9; j++){
								res = res + this.gameBlock[i][j] + ' ';
						}
						console.log(res);
				}
				
				this.gameBlockToShow = new Array(9);
				
				for(let i = 0; i < 9; i++ ){
						this.gameBlockToShow[i] = new Array(9);
				}
				
				this.unfillSudoku();
				
				console.log('-----after unfill------');
				
				for(let i = 0; i < 9; i++){
						let res = '';
						for(let j = 0; j < 9; j++){
								res = res + this.gameBlockToShow[i][j].label + ' ';
						}
						console.log(res);
				}
		}
		
		createSudokuBoardByArray(){
				console.log(this.tempArray);
				this.gameBlock[0] = this.tempArray;
				
				console.log(this.gameBlock[0]);
				this.gameBlock[1] = this.shiftArrayLeftByNTimes([...this.gameBlock[0]],3);
				console.log(this.gameBlock[1]);
				this.gameBlock[2] = this.shiftArrayLeftByNTimes([...this.gameBlock[1]],3);
				console.log(this.gameBlock[2]);
				this.gameBlock[3] = this.shiftArrayLeftByNTimes([...this.gameBlock[2]],1);
				
				console.log(this.gameBlock[3]);
				this.gameBlock[4] = this.shiftArrayLeftByNTimes([...this.gameBlock[3]],3);
				console.log(this.gameBlock[4]);
				this.gameBlock[5] = this.shiftArrayLeftByNTimes([...this.gameBlock[4]],3);
				console.log(this.gameBlock[5]);
				
				this.gameBlock[6] = this.shiftArrayLeftByNTimes([...this.gameBlock[5]],1);
				console.log(this.gameBlock[6]);
				this.gameBlock[7] = this.shiftArrayLeftByNTimes([...this.gameBlock[6]],3);
				console.log(this.gameBlock[7]);
				this.gameBlock[8] = this.shiftArrayLeftByNTimes([...this.gameBlock[7]],3);
				console.log(this.gameBlock[8]);
		}
		
		shiftArrayLeftByNTimes(tempArray,n){
				let array1 = [];
				for(let i = 0; i < n; i++)
					array1.push(tempArray.shift());
				
				let array3 = [];
				array3 = tempArray.concat(array1);
				
				return array3;
		}
		
		shuffle(array) {
				let tmp, current, top = array.length;
				if(top) while(--top) {
						current = Math.floor(Math.random() * (top + 1));
						tmp = array[current];
						array[current] = array[top];
						array[top] = tmp;
				}
				
				return array;
		}
		
		shuffleBoard(){
				for(let i = 1; i < 4; i++){
					let x =	Math.floor(Math.random() * ((i*3) - ((i-1) * 3))) + ((i-1) * 3);
					let y = Math.floor(Math.random() * ((i*3) - ((i-1) * 3))) + ((i-1) * 3);
					while(x === y){
							y = Math.floor(Math.random() * ((i*3) - ((i-1) * 3))) + ((i-1) * 3);
					}
						console.log(x + ' ' + y);
					this.shuffleBoardByRow(x,y);
				}
				
				for(let i = 1; i < 4; i++){
					let x =	Math.floor(Math.random() * ((i*3) - ((i-1) * 3))) + ((i-1) * 3);
					let y = Math.floor(Math.random() * ((i*3) - ((i-1) * 3))) + ((i-1) * 3);
					while(x === y){
							y = Math.floor(Math.random() * ((i*3) - ((i-1) * 3))) + ((i-1) * 3);
					}
					this.shuffleBoardByColumn(x,y);
				}
		}
		
		shuffleBoardByRow(x,y){
				for(let i = 0; i < 9; i++){
						let temp = this.gameBlock[x][i];
						this.gameBlock[x][i] = this.gameBlock[y][i];
						this.gameBlock[y][i] = temp;
				}
		}
		
		shuffleBoardByColumn(x,y){
				for(let i = 0; i < 9; i++){
						let temp = this.gameBlock[i][x];
						this.gameBlock[i][x] = this.gameBlock[i][y];
						this.gameBlock[i][y] = temp;
				}
		}
		
		unfillSudoku(){
				for(let i = 0; i < 9; i++){
						for(let j = 0; j < 9; j++){
								let obj;

                obj = {
                    class: 'non-selected',
                    cordinate: `${i}:${j}`,
                    label: '',
										default: false
                }
								
								if((Math.floor(Math.random() * (2 - 0)) + 0) === 0){
										obj.label = this.gameBlock[i][j].toString();
										obj.default = true;
										obj.class = 'default';
								}
								
								this.gameBlockToShow[i][j] = obj;
						}
				}
		}
		
		numberIsOkay(x,y,randomNumber){
				if(!this.checkHorizontal(x,y,randomNumber))
					return false;
				if(!this.checkVertical(x,y,randomNumber))
					return false;
				if(!this.checkQudrant(x,y,randomNumber))
					return false;
				return true
		}
		
		checkHorizontal(x,y,randomNumber){
				for(let i = 0; i < 9; i++){
						if(i !== y){
								if(this.gameBlockToShow[x][i].label === randomNumber)
										return false;
						}
				}
				return true;
		}
				
		checkVertical(x,y,randomNumber){
				for(let i = 0; i < 9; i++){
						if(i !== x){
								if(this.gameBlockToShow[i][y].label === randomNumber)
										return false;
						}
				}
				return true;
		}
		
		checkQudrant(x,y,randomNumber){
				let i,j;
				if(x <= 2 && y <= 2){
						i = 0;
						j=0;
				}
				else if(x <= 2 && y >= 3 && y <= 5){
						i = 0;
						j = 3;
				}
				else if(x <= 2 && y >= 6){
						i = 0;
						j = 6;
				}
				else if(x <= 5 && y <= 2){
						i = 3;
						j = 0;
				}
				else if(x <= 5 && y >= 3 && y <= 5){
						i = 3;
						j = 3;
				}
				else if(x <= 5 && y >= 6){
						i = 3;
						j = 6;
				}
				else if(x <= 8 && y <= 2){
						i = 6;
						j = 0;
				}
				else if(x <= 8 && y >= 3 && y <= 5){
						i = 6;
						j = 3;
				}
				else{
						i = 6;
						j = 6;
				}
				
				for(let a = i; a < i+3; a++){
						for(let b = j; b < j+3; b++){
								if(a !== x && b !== y){
										if(this.gameBlockToShow[a][b].label === randomNumber)
												return false;
								}
						}
				}
				
				return true;
		}
		
		handleBlock(event){
				console.log(event);
				let targetId = event.target.dataset.targetId;
				console.log(targetId);
				let cordinate = targetId.split(":");
				console.log(cordinate);
				if(!this.gameBlockToShow[parseInt(cordinate[0])][parseInt(cordinate[1])].default){
						this.gameBlockToShow.forEach(element => {
								element.forEach(item => {
										if(!item.default)
											item.class = 'non-selected';
								})
						})
						this.gameBlockToShow[parseInt(cordinate[0])][parseInt(cordinate[1])].class = 'selected';
						console.log(this.gameBlockToShow[parseInt(cordinate[0])][parseInt(cordinate[1])].class);
				}
				
		}
		
		handleNumber(event){
				let targetId = event.target.dataset.targetId;
				this.addNumberInBoard(targetId);
				
		}
		
		addNumberInBoard(selectedNumber){
				this.gameBlockToShow.forEach(element => {
						element.forEach(item => {
								if(item.class === 'selected'){
										if(selectedNumber === '0')
												item.label = '';
										else
												item.label = selectedNumber;
								}
						})
				})
				
				let completed = true;
				
				this.gameBlockToShow.forEach(element => {
						element.forEach(item => {
								if(item.label === ''){
										completed = false;
								}
						})
				});
				
				console.log('Completed : ' + completed);
				
				
				if(completed){
				let gameCompleted = true;
						for(let i = 0; i < 9; i++){
								for(let j = 0; j < 9; j++){
										if(!this.checkNumberIsOkay(i,j,this.gameBlockToShow[i][j].label)){
												gameCompleted = false;
												break;
										}
								}
						}
						console.log('Game Completed' + gameCompleted);
						if(gameCompleted){
								this.isGameCompleted = true;
								console.log('game completed');
						}
				}
		}
				
		checkNumberIsOkay(x,y,num){
				if(!this.checkHorizontal(x,y,num))
						return false;
				if(!this.checkVertical(x,y,num))
						return false;
				if(!this.checkQudrant(x,y,num))
						return false;
				return true;
		}
		
		addHints(){
				if(this.hintClicked)
						return false;
				if(this.totalHints > 0){
						this.gameBlockToShow.forEach((element,indexx) => {
								element.forEach((item,indexy) => {
										if(item.class === 'selected'){
												if(item.label === ''){
														item.label = this.gameBlock[indexx][indexy];
														item.class = 'default';
														item.default = true;
														this.totalHints -= 1;
												}
										}
								})
						})
				}
				return true;
		}
		
		get isHintsNotAvailable(){
				if(this.totalHints === 0)
						return true;
				return false;
		}
		
		resetGame(){
				this.gameBlockToShow.forEach((element) => {
								element.forEach((item) => {
										if(item.class !== 'default'){
												item.label = '';
										}
								})
						})
		}
		
		playAgain(){
				this.renderComplete = false;
				this.renderedCallback();
		}
}
