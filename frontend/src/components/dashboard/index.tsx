"use client";

import React, { Fragment, useEffect, useState } from "react";
import UserTable from "./UI/userTable";
import { toggleStatus, getAllUsers } from "../../ApiS/userApi";
// import { useRouter } from "next/router";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "react-toastify";

function Index() {
  const [meta, setMeta] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  // console.log(users);

  // const router = useRouter();

  useEffect(() => {
    allUsersGet();
  }, []);

  const allUsersGet = async () => {
    const limit = -1;
    try {
      // setLoading(true);
      const resp = await getAllUsers(+limit);
      if (resp?.status === 200) {
        setMeta(resp?.data?.overall);
        setTopics(resp?.data?.topics);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      // setLoading(false);
    }
  };
  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    // Redirect to login page (or homepage)
    router.push("/");
  };
  const topicToggle = async (id: any) => {
    try {
      // setLoading(true);
      const resp = await toggleStatus(id);

      if (resp?.status === 200) {
        await allUsersGet();
      }
    } catch (error: any) {
      toast.error(error?.data?.message, {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      // setLoading(false);
    }
  };

  return (
    <Fragment>
      <UserTable
        meta={meta}
        topics={topics}
        loading={loading}
        topicToggle={topicToggle}
        handleLogout={handleLogout}
      />
    </Fragment>
  );
}

export default Index;
