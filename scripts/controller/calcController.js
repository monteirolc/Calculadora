class CalcController {
  constructor() {
    this._audio = new Audio('click.mp3')
    this._audioOnOff = false
    this._operation = []
    this._lastOperator = ''
    this._lastNumber1 = 0
    this._locale = 'pt-BR'
    this._displayCalcEl = document.querySelector('#display')
    this._dateEl = document.querySelector('#data')
    this._timeEl = document.querySelector('#hora')
    this._displayCalc = '0'
    this._currentDate
    this.initialize()
    this.initButtonsEvents()
    this.initKeyboard()
    // this.pasteFromClipboard()
    this.copyToClipBoard()
  }

  initialize() {
    setInterval(() => {
      this._dateEl.innerHTML = this.currentDate.toLocaleDateString(
        this._locale,
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      )
      this._timeEl.innerHTML = this.currentDate.toLocaleTimeString(this._locale)
    }, 1000)
    this.pasteFromClipboard()
    document.querySelectorAll('.btn-ac').forEach(btn => {
      btn.addEventListener('dblclick', e => {
        this.toogleAudio()
      })
    })
  }

  toogleAudio() {
    this._audioOnOff = !this._audioOnOff
  }

  playAudio() {
    if (this._audioOnOff) {
      this._audio.currentTime = 0
      this._audio.play()
    }
  }

  initButtonsEvents() {
    this.playAudio()
    let buttons = document.querySelectorAll('#buttons > g, #parts > g')
    buttons.forEach((btn, index) => {
      this.addEventListenerAll(btn, 'click drag', e => {
        let textBtn = btn.className.baseVal.replace('btn-', '')
        this.execBtn(textBtn)
      })
      this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
        btn.style.cursor = 'pointer'
      })
    })
  }

  initKeyboard() {
    document.addEventListener('keyup', e => {
      switch (e.key) {
        case 'c':
          if (e.ctrlKey) this.copyToClipBoard()
          break

        default:
          this.execBtn(e.key)
          break
      }
    })
  }

  addEventListenerAll(element, events, functions) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, functions, false)
    })
  }

  clearAll() {
    this._operation = []
    this.lastNumber1 = 0
    this.lastOperator = ''
    this.displayCalc = '0'
  }

  clearEntry() {
    this._operation.pop()
    this.displayCalc = '0'
  }

  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value
  }

  getLastOperation() {
    return this._operation[this._operation.length - 1]
  }

  addDot() {
    let last = this.getLastOperation()

    if (typeof last === 'string' && last.split('').indexOf('.') > -1)
      return false
    if (this.isOperator(last) || !last) {
      this.pushOperation('0.')
    } else {
      this.setLastOperation(last.toString() + '.')
    }
    this.displayCalc = this._operation
  }

  isOperator(value) {
    return ['+', '-', '*', '/', '%'].indexOf(value) > -1
  }

  pushOperation(value) {
    this._operation.push(value)
    if (this._operation.length > 3) {
      this.calc()
    }
  }

  calc() {
    let last = this._operation.pop()
    let result = eval(this._operation.join(''))
    if (last == '%') {
      result = result / 100
      this._operation = [result]
    } else {
      this._operation = [result, last]
    }
    this.displayCalc = result
  }

  result() {
    try {
      let result
      console.log(this._operation)
      if (this._operation.length == 1) {
        result = eval(
          this._operation.toString() +
            this.lastOperator +
            this.lastNumber1.toString()
        )
      } else {
        this.lastOperator = this._operation[1]
        this.lastNumber1 = this._operation[2]
        result = eval(this._operation.join(''))
      }
      this.displayCalc = result
      this._operation = [result]
    } catch (error) {
      this.setError()
    }
  }

  addOperation(value) {
    if (this.lastNumber1 != 0 && this.lastOperator != '' && !isNaN(value)) {
      this.clearAll()
    }
    this.lastNumber1 = 0
    this.lastOperator = ''
    if (isNaN(this.getLastOperation()) || this.isOperator(value)) {
      //String
      if (this.isOperator(value)) {
        if (this.isOperator(this.getLastOperation())) {
          //Change operators
          this._operation[this._operation.length - 1] = value
        } else {
          //insert operators

          this.pushOperation(value)
        }
      } else {
        //First Number
        this.pushOperation(value)
        this.displayCalc = value
      }
    } else {
      let newValue = this.getLastOperation().toString() + value.toString()
      this._operation.pop()
      this.pushOperation(newValue)
      this.displayCalc = newValue
    }
  }

  setError() {
    this.displayCalc = 'ERROR'
  }

  execBtn(value) {
    this.playAudio()
    switch (value) {
      case 'ac':
      case 'Escape' /*Funções de teclado*/:
        this.clearAll()
        break
      case 'ce':
      case 'Backspace':
        this.clearEntry()
        break
      case 'porcento':
      case '%':
        this.addOperation('%')
        break
      case 'divisao':
      case '/':
        this.addOperation('/')
        break
      case 'multiplicacao':
      case '*':
        this.addOperation('*')
        break
      case 'subtracao':
      case '-':
        this.addOperation('-')
        break
      case 'soma':
      case '+':
        this.addOperation('+')
        break
      case 'igual':
      case 'Enter':
        this.result()
        break
      case 'ponto':
      case '.':
      case ',':
        this.addDot('.')
        break
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.addOperation(parseInt(value))
        break
    }
  }

  copyToClipBoard() {
    let input = document.createElement('input')
    input.value = this.displayCalc
    document.body.appendChild(input)
    input.select()
    document.execCommand('Copy')
    input.remove()
  }

  pasteFromClipboard() {
    document.addEventListener('paste', e => {
      let text = e.clipboardData.getData('text')

      this.displayCalc = parseFloat(text)
      this.setLastOperation(this.displayCalc)
    })
  }
  //#region  getters and setters
  get lastNumber1() {
    return this._lastNumber1
  }

  set lastNumber1(value) {
    this._lastNumber1 = value
  }

  get lastOperator() {
    return this._lastOperator
  }

  set lastOperator(value) {
    this._lastOperator = value
  }

  get displayCalc() {
    return this._displayCalcEl.innerHTML
  }

  set displayCalc(value) {
    if (value.toString().length > 10) {
      this.setError()
      return false
    }
    this._displayCalcEl.innerHTML = value
  }

  get currentDate() {
    return new Date()
  }

  set currentDate(value) {
    this._currentDate = value
  }
  //#endregion
}
