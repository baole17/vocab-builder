<template>
    <div class="test-container">
        <h1 class="ui header">
            <i class="graduation cap icon"></i>
            <div class="content">
                Vocabulary Test
                <div class="sub header">Test your knowledge of words in different languages</div>
            </div>
        </h1>

        <div class="ui raised segment" v-if="!testStarted">
            <h3>Test Settings</h3>
            <div class="ui form">
                <div class="field">
                    <label>Test Language</label>
                    <select v-model="testLanguage" class="ui dropdown">
                        <option value="english">English</option>
                        <option value="german">German</option>
                        <option value="vietnam">Vietnamese</option>
                    </select>
                </div>
                <div class="field">
                    <label>Number of Questions</label>
                    <select v-model="questionCount" class="ui dropdown">
                        <option value="5">5 Questions</option>
                        <option value="10">10 Questions</option>
                        <option value="15">15 Questions</option>
                    </select>
                </div>
                <button class="ui primary button" @click="startTest">
                    <i class="play icon"></i> Start Test
                </button>
            </div>
        </div>

        <div v-if="testStarted && !testCompleted" class="ui raised segment">
            <div class="ui statistics">
                <div class="statistic">
                    <div class="value">{{ currentQuestionIndex + 1 }}/{{ questionCount }}</div>
                    <div class="label">Question</div>
                </div>
                <div class="statistic">
                    <div class="value">{{ score }}</div>
                    <div class="label">Score</div>
                </div>
            </div>

            <div class="ui segment">
                <h3>Translate this word:</h3>
                <div class="ui huge label">
                    {{ currentQuestion[testLanguage] }}
                </div>
                
                <div class="ui form">
                    <div class="field">
                        <input 
                            type="text" 
                            v-model="userAnswer"
                            @keyup.enter="checkAnswer"
                            placeholder="Type your answer..."
                            ref="answerInput"
                        >
                    </div>
                    <button class="ui primary button" @click="checkAnswer">
                        Submit Answer
                    </button>
                </div>
            </div>
        </div>

        <div v-if="testCompleted" class="ui raised segment">
            <h2 class="ui header">
                <i class="trophy icon"></i>
                <div class="content">
                    Test Complete!
                    <div class="sub header">Your final score: {{ score }}/{{ questionCount }}</div>
                </div>
            </h2>
            
            <div class="ui divider"></div>
            
            <div class="ui list">
                <div class="item" v-for="(result, index) in testResults" :key="index">
                    <i :class="result.correct ? 'green check icon' : 'red times icon'"></i>
                    <div class="content">
                        <div class="header">Question {{ index + 1 }}</div>
                        <div class="description">
                            <strong>{{ result.word[testLanguage] }}</strong> = 
                            <strong>{{ result.correctAnswer }}</strong>
                            <span v-if="!result.correct" class="ui red text">
                                (Your answer: "{{ result.userAnswer }}")
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ui segment">
                <div class="ui statistics">
                    <div class="statistic">
                        <div class="value">{{ Math.round((score/questionCount) * 100) }}%</div>
                        <div class="label">Accuracy</div>
                    </div>
                    <div class="statistic">
                        <div class="value">{{ score }}/{{ questionCount }}</div>
                        <div class="label">Score</div>
                    </div>
                </div>
            </div>

            <button class="ui primary button" @click="resetTest">
                <i class="redo icon"></i> Take Another Test
            </button>
        </div>
    </div>
</template>

<script>
import { api } from '../helpers/helpers';

export default {
    name: 'Test',
    data() {
        return {
            testStarted: false,
            testCompleted: false,
            testLanguage: 'german',
            questionCount: 5,
            words: [],
            currentQuestionIndex: 0,
            currentQuestion: null,
            userAnswer: '',
            score: 0,
            testResults: [],
            loading: false
        };
    },
    methods: {
        async startTest() {
            this.loading = true;
            try {
                const allWords = await api.getWords();
                // Shuffle and slice the words array
                this.words = this.shuffleArray(allWords).slice(0, this.questionCount);
                this.currentQuestion = this.words[0];
                this.testStarted = true;
                this.testCompleted = false;
                this.currentQuestionIndex = 0;
                this.score = 0;
                this.testResults = [];
                this.$nextTick(() => {
                    if (this.$refs.answerInput) {
                        this.$refs.answerInput.focus();
                    }
                });
            } catch (error) {
                this.flash('Failed to load words for test', 'error');
            } finally {
                this.loading = false;
            }
        },

        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },

        checkAnswer() {
            let correctAnswer;
            let answerToCheck;

            // Determine which languages to compare based on test language
            switch(this.testLanguage) {
                case 'english':
                    correctAnswer = this.currentQuestion.english;
                    answerToCheck = this.currentQuestion.german;
                    break;
                case 'german':
                    correctAnswer = this.currentQuestion.german;
                    answerToCheck = this.currentQuestion.english;
                    break;
                case 'vietnam':
                    correctAnswer = this.currentQuestion.vietnam;
                    answerToCheck = this.currentQuestion.english;
                    break;
            }
            
            // Clean up strings for comparison (trim whitespace, convert to lowercase)
            const userAnswerCleaned = this.userAnswer.toLowerCase().trim();
            const correctAnswerCleaned = correctAnswer.toLowerCase().trim();
            
            const isCorrect = userAnswerCleaned === correctAnswerCleaned;
            
            if (isCorrect) {
                this.score++;
                this.flash('Correct!', 'success');
            } else {
                this.flash('Incorrect. The correct answer was: ' + correctAnswer, 'error');
            }

            this.testResults.push({
                word: this.currentQuestion,
                correct: isCorrect,
                userAnswer: this.userAnswer,
                correctAnswer: correctAnswer
            });

            this.userAnswer = '';
            this.currentQuestionIndex++;

            if (this.currentQuestionIndex < this.questionCount) {
                this.currentQuestion = this.words[this.currentQuestionIndex];
                this.$nextTick(() => {
                    if (this.$refs.answerInput) {
                        this.$refs.answerInput.focus();
                    }
                });
            } else {
                this.testCompleted = true;
            }
        },

        resetTest() {
            this.testStarted = false;
            this.testCompleted = false;
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.userAnswer = '';
            this.testResults = [];
        }
    }
};
</script>

<style scoped>
.test-container {
    padding: 20px;
}

.ui.statistics {
    margin-bottom: 2em;
    justify-content: center;
}

.ui.huge.label {
    margin: 1em 0;
    font-size: 2em !important;
    display: block;
    text-align: center;
}

.ui.form {
    max-width: 500px;
    margin: 2em auto;
}

.ui.list .item {
    padding: 1em 0;
}

.ui.red.text {
    color: #db2828;
}

.ui.button {
    margin-top: 1em;
}

.ui.divider {
    margin: 2em 0;
}
</style>
