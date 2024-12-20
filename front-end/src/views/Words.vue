<template>
    <div class="words-container">
        <h1 class="ui header">
            <i class="language icon"></i>
            <div class="content">
                Vocabulary Collection
                <div class="sub header">Manage your multilingual word collection</div>
            </div>
        </h1>

        <div class="ui raised segment">
            <table class="ui selectable celled padded table">
                <thead>
                    <tr>
                        <th class="single line">
                            <i class="uk flag"></i> English
                        </th>
                        <th>
                            <i class="germany flag"></i> German
                        </th>
                        <th>
                            <i class="vietnam flag"></i> Vietnamese
                        </th>
                        <th class="center aligned">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(word, i) in words" :key="i" class="word-row">
                        <td>{{ word.english }}</td>
                        <td>{{ word.german }}</td>
                        <td>{{ word.vietnam }}</td>
                        <td class="center aligned">
                            <div class="ui tiny buttons">
                                <router-link 
                                    :to="{ name: 'show', params: { id: word._id }}"
                                    class="ui blue basic button"
                                >
                                    <i class="eye icon"></i> View
                                </router-link>
                                <router-link 
                                    :to="{ name: 'edit', params: { id: word._id }}"
                                    class="ui green basic button"
                                >
                                    <i class="edit icon"></i> Edit
                                </router-link>
                                <button 
                                    class="ui red basic button"
                                    @click.prevent="onDestroy(word._id)"
                                >
                                    <i class="trash icon"></i> Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Empty state -->
        <div v-if="!words.length" class="ui placeholder segment">
            <div class="ui icon header">
                <i class="book icon"></i>
                No words found
                <div class="sub header">Start by adding some new words to your collection</div>
            </div>
            <router-link to="/words/new" class="ui primary button">
                <i class="plus icon"></i> Add New Word
            </router-link>
        </div>
    </div>
</template>

<script>
import router from '@/router';
import { api } from '../helpers/helpers';

export default {
    name: 'Words',
    data() {
        return {
            words: [],
            loading: true
        };
    },
    methods: {
        async onDestroy(id) {
            try {
                const sure = await this.$confirm(
                    'Are you sure you want to delete this word?',
                    'Confirm Deletion',
                    {
                        confirmButtonText: 'Yes, Delete',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }
                );
                
                await api.deleteWord(id);
                this.flash('Word successfully deleted!', 'success');
                this.words = this.words.filter(word => word._id !== id);
            } catch (err) {
                console.error('Deletion failed:', err);
            }
        }
    },
    async mounted() {
        try {
            this.loading = true;
            this.words = await api.getWords();
        } catch (error) {
            this.flash('Failed to load words', 'error');
        } finally {
            this.loading = false;
        }
    }
};
</script>

<style scoped>
.words-container {
    padding: 20px;
}

.ui.header {
    margin-bottom: 30px;
}

.word-row:hover {
    background-color: #f8f9fa;
    transition: background-color 0.2s ease;
}

.ui.buttons .button {
    margin: 0 2px;
}

.ui.table {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.ui.placeholder.segment {
    margin-top: 40px;
}

/* Animation for row updates */
.word-row {
    transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .ui.tiny.buttons {
        display: flex;
        flex-direction: column;
    }
    
    .ui.tiny.buttons .button {
        margin: 2px 0;
    }
}
</style>