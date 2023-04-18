"use client";
import { supabase } from "../../supabaseClient";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import Reroute from "../components/reroute";
import Loading from "../loading";
import Profiletable from "../components/profiletable";
import Signuptable from "../components/signuptable";
import Shiftstable from "../components/shiftstable";
import Defaultpage from "../components/default";
import Navbar from "../components/navbar";
import Stats from "../components/stats";

import "../../styles/homepage.css";

export default function Home() {
  const [admin, setAdmin] = useState(null);
  const [people, setPeople] = useState(null);
  const [signups, setSignups] = useState(null);
  const [shifts, setShifts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("Home");
  const router = useRouter();

  // For the future, fetchProfiles(), fetchSignups(), and fetchShifts() should be moved to another file
  // that is NOT a client component, so they can be rendered on server instead of all on client
  const fetchProfiles = async () => {
    await supabase
      .from("profiles")
      .select()
      .then((profiles, err) => {
        if (profiles) {
          setPeople(profiles);
        } else {
          console.log("error in profiles");
        }
      })
      .then(console.log("this is profiles"));
  };

  const fetchSignups = async () => {
    await supabase
      .from("signups")
      .select()
      .then((signups, err) => {
        if (signups) {
          setSignups(signups);
        } else {
          console.log("error in signups");
        }
      })
      .then(console.log("this is signups"));
  };

  const fetchShifts = async () => {
    await supabase
      .from("shifts")
      .select()
      .then((shifts, err) => {
        if (shifts) {
          setShifts(shifts);
        } else {
          console.log("error in shifts");
        }
      })
      .then(console.log("this is shifts"));
  };

  useEffect(() => {
    // Get all table information at once (delete this once the methods here can be moved to server-side rendering)
    const fetchTables = async () => {
      try {
        setIsLoading(true);

        const {
          data: { user },
          error: getUserError,
        } = await supabase.auth.getUser();
        if (getUserError) {
          throw new Error(getUserError);
        }

        const { data, error: getAdminError } = await supabase
          .from("admins")
          .select()
          .eq("id", user.id);
        if (getAdminError) {
          throw new Error(getAdminError);
        }

        // check if logged in user id is registered in the admin table
        if (data.length !== 0) {
          // admin should be uniquely associated with user id
          setAdmin(data[0]);
          console.log("this user is an admin");

          await Promise.all([fetchProfiles(), fetchSignups(), fetchShifts()]);
        } else {
          console.log("this user is not an admin");
        }
      } catch (err) {
        console.log("caught error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTables();
  }, []);

  const logout = useCallback(async () => {
    supabase.auth
      .signOut()
      .then(() => router.push("/"))
      .catch((err) => console.error(err));
  }, [router]);

  if (isLoading || !people || !signups || !shifts) {
    // 한 가지라도 로드 안 됐으면...
    return <Loading />;
  }

  if (!admin) {
    // Send the user here if they are not admin
    return <Reroute />;
  }

  // NOTE: According to https://stackoverflow.com/questions/66729498/next-js-is-not-rendering-css-in-server-side-rendering
  // If you are not in production, the CSS/styles will not be loaded on the first fetch (refresh to see)

  return (
    <div className="flex flex-col">
      <Navbar setContent={setContent} logout={logout} />

      <div className="">
        {content === "Home" && <Defaultpage />}
        {content === "Profiles" && <Profiletable profiles={people} />}
        {content === "Signups" && (
          <Signuptable signups={signups} shifts={shifts} />
        )}
        {content === "Shifts" && (
          <Shiftstable signups={signups} shifts={shifts} />
        )}
        {content === "Stats" && <Stats signups={signups} shifts={shifts} />}
      </div>
    </div>
  );
}
