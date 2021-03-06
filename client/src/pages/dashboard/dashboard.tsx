import Taro, { Component } from '@tarojs/taro';
import { View, Navigator } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx'

import "./dashboard.scss"
import withLogin from "../../common/decorator/withLogin";
import { IQuestionDataModel } from "../../models/dashiboard";
import { HtmlParse } from '../../components/htmlParse/htmlParse';
import { NavigationBar, Loading, WecharAuthorize, ResourceAuthorize } from '../../components';
import { UserResource } from '../../common/enums';

interface DashboardState {
    scrollTop: number
}

interface DashboardProps {
    dashboardStore: {
        loading: boolean,
        question: IQuestionDataModel,
        getQuestionAsync: () => {}
    },
    authorizationStore: {
        isAuthorized: boolean,
        update: () => {}
    }
}

@inject("dashboardStore", "authorizationStore")
@observer
@withLogin()
export default class Dashboard extends Component<DashboardProps, DashboardState> {
    constructor() {
        super()
        this.state = {
            scrollTop: 0
        }
    }

    async componentWillMount() {
        const { getQuestionAsync } = this.props.dashboardStore;
        await getQuestionAsync();
    }

    onPageScroll = (e) => {
        this.setState({
            scrollTop: e.scrollTop
        })
    }

    async onPullDownRefresh() {
        await this.props.dashboardStore.getQuestionAsync();
        Taro.stopPullDownRefresh();
    }

    render() {
        const { windowHeight } = Taro.getSystemInfoSync();
        const { scrollTop } = this.state;
        const { dashboardStore: { question, loading } } = this.props;
        return (
            <View className="page" style={{ height: windowHeight + "px" }}>
                <NavigationBar title="推荐" scrollTop={scrollTop}></NavigationBar>
                <Loading loading={loading}></Loading>
                <View>
                    {
                        question ? <View className="page-content">
                            <HtmlParse data={question.describe}></HtmlParse>
                            <WecharAuthorize authorizationStore={this.props.authorizationStore}>
                                <ResourceAuthorize resources={[UserResource.QuertionAnswerCreate]}>
                                    <View className="tools"><Navigator url={`./userAnswer?questionId=${question.id}`}>翻译与分析</Navigator></View>
                                </ResourceAuthorize>
                            </WecharAuthorize>
                        </View> : null
                    }
                </View>
            </View >
        )
    }
}
