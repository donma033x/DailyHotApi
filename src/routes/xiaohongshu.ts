import type { RouterData } from "../types.js";
import type { RouterType } from "../router.types.js";
import { get } from "../utils/getData.js";
import { getTime } from "../utils/getTime.js";

// 小红书热榜接口处理函数
export const handleRoute = async (_: undefined, noCache: boolean) => {
  const listData = await getList(noCache);
  const routeData: RouterData = {
    name: "xiaohongshu",
    title: "小红书",
    type: "热榜",
    description: "小红书实时热搜榜",
    link: "https://www.xiaohongshu.com",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 获取热榜数据
const getList = async (noCache: boolean) => {
  const url = "https://api.rebang.today/v1/items?tab=xiaohongshu&sub_tab=hot-search&page=1&version=1";

  // 发送请求
  const result = await get({
    url,
    noCache,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  // 假设返回的数据是一个包含热榜项目的数组
  const list = result.data || [];

  // 格式化返回数据
  return {
    ...result,
    data: list.map((v: any) => ({
      id: v.id || "", // 假设有id字段
      title: v.title || v.keyword || "", // 使用title或keyword作为标题
      timestamp: getTime(v.created_at || v.time || 0), // 假设有created_at或time字段
      hot: v.hot_value || v.score || 0, // 热度值，假设字段为hot_value或score
      url: v.url || `https://www.xiaohongshu.com/discovery/item/${v.id}`, // 如果有url字段直接使用，否则构造
      mobileUrl: v.mobile_url || `https://www.xiaohongshu.com/discovery/item/${v.id}`, // 同上
    })),
  };
};
