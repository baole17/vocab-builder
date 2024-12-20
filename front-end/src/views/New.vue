<template>
    <div>
        <h1 class="ui header">
            <i class="plus circle icon"></i>
            <div class="content">
                Add New Word
                <div class="sub header">Add a new word to your vocabulary collection</div>
            </div>
        </h1>
        <div class="ui raised segment">
            <word-form @createOrUpdate="createOrUpdate"></word-form>
        </div>
    </div>
</template>

<script>
import WordForm from '../components/WordForm.vue';
import { api } from '../helpers/helpers';

export default {
    name: 'new-word',
    components: {
        'word-form': WordForm
    },
    methods: {
        async createOrUpdate(word) {
            try {
                const res = await api.createWord(word);
                this.flash('Word created successfully!', 'success');
                this.$router.push(`/words/${res._id}`);
            } catch (error) {
                this.flash('Failed to create word', 'error');
                console.error('Error creating word:', error);
            }
        }
    }
};
</script>

<style scoped>
.ui.raised.segment {
    margin-top: 20px;
}
</style>