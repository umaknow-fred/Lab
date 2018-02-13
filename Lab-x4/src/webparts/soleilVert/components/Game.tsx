import * as React from 'react';
import { IGameState, History } from './ISoleilVertProps';
import Board from './Board';


export default class Game extends React.Component<IGameProp, IGameState> {
  constructor(props) {
    super(props);
    this.state = {
      history: [new History()],
      xIsNext: true,
      stepNumber: 0,
    } as IGameState;
  }

  public render(): React.ReactElement<IGameProp> {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    
    const winner = this.calculateWinner(current.squares);
    const player = this.state.xIsNext ? "X" : "O";
    let status = `Next player: ${player}`;
    if (winner) {
      status = `Winner: ${winner}`;
    }

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumbTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onclick={(i: number) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  private handleClick(i: number): void {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState(x => {
      const h = new History();
      h.squares = squares;
      return {
        history: history.concat(h),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      } as IGameState;
    });
  }

  private jumbTo(step: number): void {
    this.setState(x => {
      x.stepNumber = step;
      x.xIsNext = (step % 2) === 0;
      return x;
    });
  }

  private calculateWinner(squares: string[]): string {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    return null;
  }
}

export interface IGameProp {
  ok?: boolean;
}