// 定义游戏类
class Game2048 {
    constructor(size, target) {
        this.size = size;
        this.target = target;
        this.board = this.createBoard();
        this.addRandomTile();
        this.addRandomTile();
    }

    // 创建游戏板
    createBoard() {
        return Array.from({ length: this.size }, () => Array(this.size).fill(0));
    }

    // 随机添加方块
    addRandomTile() {
        const emptyTiles = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.board[r][c] === 0) emptyTiles.push([r, c]);
            }
        }
        if (emptyTiles.length > 0) {
            const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // 左移
    moveLeft() {
        let moved = false;
        for (let r = 0; r < this.size; r++) {
            let row = this.board[r].filter(val => val); // 去掉所有为0的值
            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] === row[i + 1]) {
                    row[i] *= 2;
                    row.splice(i + 1, 1); // 删除已经合并的块
                    moved = true;
                }
            }
            while (row.length < this.size) row.push(0); // 补全为0的值
            if (this.board[r].toString() !== row.toString()) moved = true;
            this.board[r] = row;
        }
        if (moved) this.addRandomTile();
    }

    // 右移
    moveRight() {
        let moved = false;
        for (let r = 0; r < this.size; r++) {
            let row = this.board[r].filter(val => val).reverse(); // 去掉所有为0的值并反转数组
            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] === row[i + 1]) {
                    row[i] *= 2;
                    row.splice(i + 1, 1); // 删除已经合并的块
                    moved = true;
                }
            }
            while (row.length < this.size) row.push(0); // 补全为0的值
            row.reverse(); // 恢复原始方向
            if (this.board[r].toString() !== row.toString()) moved = true;
            this.board[r] = row;
        }
        if (moved) this.addRandomTile();
    }

    // 上移
    moveUp() {
        let moved = false;
        for (let c = 0; c < this.size; c++) {
            let col = [];
            for (let r = 0; r < this.size; r++) {
                if (this.board[r][c] !== 0) col.push(this.board[r][c]);
            }
            for (let i = 0; i < col.length - 1; i++) {
                if (col[i] === col[i + 1]) {
                    col[i] *= 2;
                    col.splice(i + 1, 1); // 删除已经合并的块
                    moved = true;
                }
            }
            while (col.length < this.size) col.push(0); // 补全为0的值
            for (let r = 0; r < this.size; r++) {
                if (this.board[r][c] !== col[r]) moved = true;
                this.board[r][c] = col[r];
            }
        }
        if (moved) this.addRandomTile();
    }

    // 下移
    moveDown() {
        let moved = false;
        for (let c = 0; c < this.size; c++) {
            let col = [];
            for (let r = this.size - 1; r >= 0; r--) {
                if (this.board[r][c] !== 0) col.push(this.board[r][c]);
            }
            for (let i = 0; i < col.length - 1; i++) {
                if (col[i] === col[i + 1]) {
                    col[i] *= 2;
                    col.splice(i + 1, 1); // 删除已经合并的块
                    moved = true;
                }
            }
            while (col.length < this.size) col.push(0); // 补全为0的值
            col.reverse();
            for (let r = 0; r < this.size; r++) {
                if (this.board[r][c] !== col[r]) moved = true;
                this.board[r][c] = col[r];
            }
        }
        if (moved) this.addRandomTile();
    }

    // 检查游戏是否结束
    isGameOver() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.board[r][c] === 0) return false;
                if (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) return false;
                if (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c]) return false;
            }
        }
        return true;
    }

    // 检查是否获胜
    hasWon() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.board[r][c] === this.target) return true;
            }
        }
        return false;
    }
}

// 初始化游戏
let game;

function startGame(target) {
    game = new Game2048(4, target);
    updateBoard();
}

// 更新游戏板
function updateBoard() {
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = '';
    for (let r = 0; r < game.size; r++) {
        for (let c = 0; c < game.size; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = game.board[r][c] === 0 ? '' : game.board[r][c];
            boardElement.appendChild(tile);
        }
    }
    if (game.hasWon()) {
        alert('You win!');
    } else if (game.isGameOver()) {
        alert('Game over!');
    }
}

// 监听键盘事件以控制方块的移动
document.addEventListener('keydown', (e) => {
    if (!game) return;

    switch (e.key) {
        case 'ArrowLeft':
            game.moveLeft();
            break;
        case 'ArrowRight':
            game.moveRight();
            break;
        case 'ArrowUp':
            game.moveUp();
            break;
        case 'ArrowDown':
            game.moveDown();
            break;
    }
    updateBoard();
});
