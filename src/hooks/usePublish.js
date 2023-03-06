import axios from "axios";
import { useEffect, useState } from "react";
import openNotification from "../hooks/useNotification";
function usePublish(type) {
  const { username } = JSON.parse(localStorage.getItem("token"));
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios(
      `/news?author=${username}&publishState=${type}&_expand=category`
    ).then((res) => {
      setDataSource(res.data);
    });
  }, [username, type]);
  const handlePublish = (id) => {
    console.log(id);
    setDataSource(dataSource.filter((item) => item.id !== id));
    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        openNotification("bottomRight", 2);
      });
  };
  const handleSunset = (id) => {
    setDataSource(dataSource.filter((item) => item.id !== id));
    axios
      .patch(`/news/${id}`, {
        publishState: 3,
      })
      .then((res) => {
        openNotification("bottomRight", undefined, "已下线中");
      });
  };
  const handleDelete = (id) => {
    setDataSource(dataSource.filter((item) => item.id !== id));
    axios.delete(`/news/${id}`).then((res) => {
      openNotification("bottomRight", undefined, "已删除了新闻");
    });
  };

  return { dataSource, handlePublish, handleSunset, handleDelete };
}

export default usePublish;
