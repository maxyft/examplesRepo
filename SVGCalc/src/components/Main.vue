<template>
  <div class="wrapper">
    <div class="expression-wrapper">
      <p data-number="1" data-val="a">{{ a }}</p>
      <p> + </p>
      <p data-number="2" data-val="b">{{ b }}</p>
      <p> = </p>
      <p class="expression-result">{{ resultFromUser && resultFromUser == result ? result : '?'}}</p>
      <input type="number" class="user-input hidden result" style="position:relative;" @keyup="checkResult($event)" v-model="resultFromUser">
    </div>
    <div class="svg-wrapper">
      <input type="number" class="user-input hidden" v-model="aFromUser" data-number="1" data-val="a" @keyup="checkInput($event)">
      <input type="number" class="user-input hidden" v-model="bFromUser" data-number="2" data-val="b" @keyup="checkInput($event)">
      <p class="right-num hidden" data-number="1" data-val="a">{{ a }}</p>
      <p class="right-num hidden" data-number="2" data-val="b">{{ b }}</p>
      <div class="svg-line-wrapper">
        <svg class="svg-line">
          <defs>
            <marker id="arrow" markerWidth="16" markerHeight="16" refY="8">
              <path d="M0,0 L16,8 L0,16" fill="transparent" stroke-width="1px" stroke="gray"/>
              <path d="M0,8 L16,8" fill="transparent" stroke-width="1px" stroke="gray"/>
            </marker>
            <marker id="pointer" markerWidth="20" markerHeight="20" refX="7" refY="5" orient="auto">
              <path d="M0,0 L10,5 L0,10" fill="transparent" stroke-width="1px" stroke="red"/>
            </marker>
          </defs>
          <line y1="50%" x2="100%" y2="50%" class="svg-line_main-line" marker-end="url(#arrow)"></line>
          <g class="delimeters">
            <line class="svg-line_delimiter-line" y1="20%" y2="80%" v-for="num in nums" :key="num"
            :class="{ bold: num === 0 || num % 5 == 0}">
            </line>
          </g>
          <g class="arrows"></g>
        </svg>
      </div>
      <div class="svg-nums">
        <div class="svg-nums_num" v-for="num in nums"
        :key="num"
        :class="{ bold: num === 0 || num % 5 == 0}">
          <p> {{ num }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'Main',
  data () {
    return {
      nums: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      aMin: 6,
      aMax: 9,
      resultPossible: [11, 12, 13, 14],
      a: null,
      b: null,
      result: null,
      aFromUser: null,
      bFromUser: null,
      resultFromUser: null,
      curvs: []
    }
  },
  mounted () {
    this.constructSVG()
    this.createExpression()
    $(window).bind('resize', this.constructSVG)
    $(window).bind('resize', this.reflowCurved)
  },
  beforeDedstroy () {
    $(window).unbind('resize', this.constructSVG)
  },
  methods: {
    constructSVG () {
      let lines = $('.svg-line_delimiter-line')
      $('.svg-nums_num').each((index, item) => {
        let position = $(item).position().left
        let textWidth = $(item).children('p').css('width')
        if (index === 0) {
          $('.svg-line_main-line').attr('x1', position + parseFloat(textWidth) / 2)
        }
        $(lines[index]).attr('x1', position + parseFloat(textWidth) / 2)
        $(lines[index]).attr('x2', position + parseFloat(textWidth) / 2)
      })
    },
    createExpression () {
      let a = Math.floor(Math.random() * (this.aMax + 1 - this.aMin) + this.aMin);
      let bPossible = this.resultPossible.map(item => item - a);
      let bMin = Math.min(...bPossible);
      let bMax = Math.max(...bPossible);
      let b = Math.floor(Math.random() * (bMax + 1 - bMin) + bMin);
      this.a = a;
      this.b = b;
      this.result = a + b;
      this.curvs.push([0, a]);
      this.curvs.push([a, a + b]);
      this.createCurved();
    },
    createCurved () {
      let current = 1;
      let padding = parseFloat($('.svg-wrapper').css('padding-left'));
      this.curvs.forEach(item => { // typeof item === array
        let lines = $('.svg-line_delimiter-line');
        let x1 = $(lines[item[0]]).attr('x1');
        let x2 = $(lines[item[1]]).attr('x1');
        let curved = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let dAttr = '';

        current === 1 ? dAttr = `M${x1}, 0 C${x1 + 25}, -75 ${x2 - 25}, -75 ${x2}, 0`
                      : dAttr = `M${x1}, -10 C${x1 + 30}, -40 ${x2 - 30}, -40 ${x2}, 0`;

        curved.setAttribute('d', dAttr);
        curved.setAttribute('marker-end', 'url(#pointer)');
        curved.setAttribute('class', 'arrow');
        curved.setAttribute('style', 'stroke: red; fill: transparent');
        $('.arrows').append(curved);

        let width = curved.getBoundingClientRect().width;
        let height = curved.getBoundingClientRect().height;
        let offset = (parseFloat(x1) + padding + width / 2 - 12.5) + 'px';

        $(`input[data-number=${current}]`).css('left', offset);
        $(`.right-num[data-number=${current}]`).css('left', offset);
        $(`input[data-number=${current}]`).css('top', -height - 25);
        $(`.right-num[data-number=${current}]`).css('top', -height - 25);

        $(`input[data-number=${current}]`).removeClass('hidden');

        if (current === 1 && this.aFromUser == this.a)  { // fix for resize
          $(`input[data-number=${current}]`).addClass('hidden');
        }
        if (current === 2 && this.bFromUser == this.b)  { // fix for resize
          $(`input[data-number=${current}]`).addClass('hidden');
        }
        if (current === 2 && this.aFromUser != this.a)  {
          $(`input[data-number=${current}]`).addClass('hidden');
          $(curved).css('display', 'none');
        }
        current++;
      });
    },
    reflowCurved () {
      $('.arrows').children().each((index, item) => {
        $(item).remove();
      });
      this.createCurved();
    },
    checkInput (event) {
      let input = event.target;
      let inputVal = input.dataset.val; // a or b
      let inputNum = input.dataset.number; // 1 or 2
      if (this[inputVal] != this[inputVal + 'FromUser']) {
        $(input).addClass('wrong');
        $(`p[data-val=${inputVal}]`).addClass('wrong');
      } else {
        $(input).addClass('hidden');
        $(`p[data-val=${inputVal}]`).removeClass('wrong');
        $(`p[data-val=${inputVal}]`).removeClass('hidden');
        $($('.arrow')[inputNum]).css('display', 'block');
        $('input[data-number=' + (++inputNum) + ']').removeClass('hidden');
        if(this.bFromUser) {
          $('input.result').removeClass('hidden');
          $('p.expression-result').addClass('hidden');
        }
      }
    },
    checkResult(event) {
      let input = event.target;
      if(this.resultFromUser != this.result) {
        $(input).css('color', 'red');
      } else {
        $(input).css('display', 'none');
        $('.expression-result').css('display', 'block');
      }
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    position: relative;
    width: 75%;
    margin: auto;
    .expression-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      margin-bottom: 15vh;
      p {
        flex: auto;
        flex-grow: 0;
        font-size: 1.9rem;
        margin: 0 3px;
        &.wrong {
          background: yellow;
        }
      }
    }
    .svg-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 1.5% 5%;
      background: linear-gradient(to bottom, #ffffcc, #f7eacd);
      border-radius: 10px;
    }
    .svg-line-wrapper {
      flex: auto;
      flex-grow: 0;
      height: 35px;
      .svg-line {
        width: 100%;
        height: 100%;
        overflow: visible;
        .svg-line_main-line {
          stroke: gray;
          stroke-width: 1.25px;
        }
        .svg-line_delimiter-line {
          stroke: black;
          stroke-width: 1px;
          &.bold {
            stroke-width: 2px;
          }
        }
      }
    }
    .svg-nums {
      position: relative;
      flex: auto;
      flex-grow: 0;
      height: 25px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .svg-nums_num {
        position: relative;
        flex: auto;
        flex-wrap: nowrap;
        flex-basis: 30px;
        font-size: 1rem;
        &.bold {
          font-weight: bold;
        }
        p {
          float: left;
          margin: 0;
        }
      }
    }
  }
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
      -moz-appearance:textfield;
  }
  .user-input {
    position: absolute;
    width: 25px;
    height: 25px;
    text-align: center;
    border-radius: 2.5px;
    outline: none;
    &.wrong {
      color: red;
    }
    &.result {
      font-size: 1.7rem;
      max-width: 70px;
      height: auto;
      flex: auto;
    }
    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }
  .right-num {
    position: absolute;
    text-align: center;
    margin: 0;
    width: 25px;
    height: 25px;
    line-height: 25px;
  }
  .hidden {
    display: none;
  }
</style>
