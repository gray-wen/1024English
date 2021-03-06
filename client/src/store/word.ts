import { observable } from 'mobx'

import { IWordDataModel, IWordListDataModel, IWordListQueryModel, IWordCreateModel } from '../models/word';
import { BaseStore } from './base.store';

class WordStore extends BaseStore {
    @observable
    word: IWordDataModel;
    @observable
    wordList: IWordListDataModel[];
    @observable
    showLoadMore: boolean;
    @observable
    wordListQuery: IWordListQueryModel = { page: 0, pageSize: 20 };
    @observable
    wordDetail: IWordDataModel;

    constructor() {
        super();
        this.loading = false;
    }

    reset = () => {
        this.wordList = [];
        this.wordListQuery.page = 0;
    }

    getWordAsync = async () => {
        this.word = await this.get("word/getWord");
    }

    getNextWordAsync = async () => {
        let _word = await this.get("word/getNextWord");
        if (_word) {
            this.word = _word;
        }
        return _word;
    }

    collectWordAsync = async () => {
        let params = { wordId: this.word.id };
        this.word.collectionId = await this.post("word/collectWord", params);
    }

    collectDetailWordAsync = async () => {
        let params = { wordId: this.wordDetail.id };
        this.wordDetail.collectionId = await this.post("word/collectWord", params);
    }

    getWordListAsync = async (page: number, pageSize: number) => {
        return  await this.get("word/getWordList",  { page: page, pageSize: pageSize });
    }
    
    getWordDetailAsync = async (wordId: number) => {
        let wordDetail = await this.get("word/getWordDetail", { wordId: wordId });
        this.wordDetail = wordDetail;
        return wordDetail;
    }

    translateWordAsync = async (text: string) => {
        return await this.post("word/translate", { text: text, type: 1 });
    }

    getWordByAutoCompleteAsync = async (query: string) => {
        return await this.get("autoComplete/word", { query: query });
    }

    createWordAsync = async (word: IWordCreateModel) => {
        return await this.post("word/createWord", word);
    }

    updateWordAsync = async (word: IWordCreateModel) => {
        return await this.post("word/updateWord", word);
    }
}

export default new WordStore()