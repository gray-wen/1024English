import Taro, { Component } from "@tarojs/taro";
import "./word.scss"
import { View, Text, Navigator } from "@tarojs/components";
import { observer, inject } from '@tarojs/mobx';

import { NavigationBar, WecharAuthorize, Loading, ResourceAuthorize } from "../../components";
import { IWordDataModel } from "../../models/word";
import { readingText } from "../../utils/baiduUtils";
import { showMessage } from "../../utils/wechatUtils";
import { UserResource } from "../../common/enums";
import justNavigationBar from "../../common/decorator/justNavigationBar";
import justLogin from "../../common/decorator/justLogin";

interface WordProps {
    wordStore: {
        loading: boolean,
        word: IWordDataModel,
        getWordAsync: () => {},
        getNextWordAsync: () => {},
        collectWordAsync: () => {}
    },
    authorizationStore: {
        isAuthorized: boolean,
        update: () => {}
    }
}

@inject("wordStore", "authorizationStore")
@observer
@justLogin()
@justNavigationBar({ navigationBarTitleText: "技术词汇" })
export default class Word extends Component<WordProps, {}> {
    async componentWillMount() {
        const { getWordAsync } = this.props.wordStore;
        getWordAsync();
    }

    onCollectWord = async () => {
        const { collectWordAsync } = this.props.wordStore;
        await collectWordAsync();
        Taro.vibrateShort();
    }

    onGetNextWord = async () => {
        const { getNextWordAsync } = this.props.wordStore;
        if (!await getNextWordAsync()) {
            showMessage("更多词汇还在路上...");
        }
    }

    async onPullDownRefresh() {
        await this.props.wordStore.getWordAsync();
        Taro.stopPullDownRefresh();
    }

    render() {
        const { windowHeight } = Taro.getSystemInfoSync();
        const { wordStore: { word, loading } } = this.props;

        return <View className="page" style={{ height: windowHeight + "px" }}>
            <NavigationBar title="技术词汇"></NavigationBar>
            <Loading loading={loading}></Loading>
            {word ? <View className="page-content">
                <View className="page-nav">

                </View>
                <View className="flex-custom">
                    <View className="flex-custom-item">
                        <View className="flex-custom-item-word" onClick={() => { readingText(word.english) }}>
                            {word.english}
                        </View>
                        {
                            word.phoneticUS ?
                                <View className="flex-custom-item-phonetic">
                                    <View className="text-ellipsis">{word.phoneticEN}</View>
                                    <View className="text-ellipsis" onClick={() => { readingText(word.english) }}>{word.phoneticUS}</View>
                                    <Text className="icomoonfont icon-sound"></Text>
                                </View> : null
                        }
                        <View className="flex-custom-item-cn">
                            <View>{word.chinese}</View>
                        </View>
                        {
                            word.collocation ? <View>
                                <View className="flex-custom-item-title">搭配</View>
                                <View className="flex-custom-item-collocation">{word.collocation}</View>
                            </View> : null
                        }
                        <View className="flex-custom-item-title">例句{/* <Navigator url="">(推荐?)</Navigator> */}</View>
                        <View className="flex-custom-item-sentences">
                            {
                                word.sentences.map((sentence, index) => {
                                    return <View key={"sentence-" + index}>
                                        <View className="text-newline">
                                            {sentence.chinese}
                                        </View>
                                        <View className="text-newline">
                                            {sentence.english}
                                        </View>
                                    </View>
                                })
                            }

                        </View>


                        <View className="page-tools">
                            <View className="page-tools-item page-tools-item-next">
                                <WecharAuthorize authorizationStore={this.props.authorizationStore}>
                                    <View onClick={this.onGetNextWord}>下一个词汇</View>
                                </WecharAuthorize>
                                <WecharAuthorize authorizationStore={this.props.authorizationStore}>
                                    <ResourceAuthorize resources={[UserResource.WordCollect]}>
                                        <View className=" page-tools-item-love" onClick={this.onCollectWord}>
                                            {
                                                word && word.collectionId ?
                                                    <Text style={{ color: "#3271fd" }} className="icomoonfont icon-heart-fill icon-love"></Text> :
                                                    <Text style={{ color: "#3271fd" }} className="icomoonfont icon-heart icon-love"></Text>
                                            }
                                        </View>
                                    </ResourceAuthorize>
                                </WecharAuthorize>
                            </View>
                        </View>

                        <WecharAuthorize authorizationStore={this.props.authorizationStore}>
                            <View className="page-help">
                                <Navigator url={`../me/feedback?wordId=${word.id}`}>单词有问题?</Navigator>
                            </View>
                        </WecharAuthorize>
                    </View>
                </View>
            </View> : null
            }
        </View>
    }
}