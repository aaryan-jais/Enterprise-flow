import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

import {
  Users,
  FolderKanban,
  TrendingUp,
  DollarSign,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { fetchDashboard } from "../store/slices/dashboardSlice";

import StatCard from "../components/dashboard/StatCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import ProjectStatusChart from "../components/dashboard/ProjectStatusChart";
import DateFilter from "../components/dashboard/DateFilter";

import Loader from "../components/common/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState("30d");

  const {
    users,
    projects,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  // Fetch dashboard data
  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  // Completed projects
  const completedProjects = useMemo(() => {
    return projects.filter(
      (project) => project.status === "Completed"
    ).length;
  }, [projects]);

  // Active projects
  const activeProjects = useMemo(() => {
    return projects.filter(
      (project) => project.status === "In Progress"
    ).length;
  }, [projects]);

  // Average project progress
  const averageProgress = useMemo(() => {
    if (!projects.length) {
      return 0;
    }

    const total = projects.reduce(
      (sum, project) =>
        sum + Number(project.progress || 0),
      0
    );

    return Math.round(total / projects.length);
  }, [projects]);

  // Loading state
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Overview of your enterprise operations.
          </p>
        </div>
      </div>


      {/* ERROR */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* STATS */}
      <div className="stats-grid">

        <StatCard
          title="Total Users"
          value={users.length}
          icon={Users}
          change="+12.5%"
        />

        <StatCard
          title="Total Projects"
          value={projects.length}
          icon={FolderKanban}
          change="+8.2%"
        />

        <StatCard
          title="Active Projects"
          value={activeProjects}
          icon={TrendingUp}
          change="+5.4%"
        />

        <StatCard
          title="Avg. Progress"
          value={`${averageProgress}%`}
          icon={DollarSign}
          change={`${completedProjects} completed`}
        />

      </div>


      {/* MAIN CONTENT */}
      <div className="dashboard-grid dashboard-grid-three">


        {/* PROJECT STATUS */}
        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h2>Project Status</h2>

              <p>
                Current project distribution
              </p>
            </div>

          </div>

          <ProjectStatusChart
            projects={projects}
          />

        </div>


        {/* PROJECT PERFORMANCE */}
        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h2>Project Performance</h2>

              <p>
                Project activity overview
              </p>
            </div>

            <DateFilter
              value={dateRange}
              onChange={setDateRange}
            />

          </div>

          <RevenueChart />

        </div>


        {/* RECENT PROJECTS */}
        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h2>Recent Projects</h2>

              <p>
                Latest project activity
              </p>
            </div>

          </div>


          <div className="recent-projects">

            {projects.length > 0 ? (
              projects
                .slice(0, 5)
                .map((project, index) => {

                  const progress = Number(
                    project.progress || 0
                  );

                  return (
                    <div
                      className="recent-project"
                      key={
                        project.id ||
                        `recent-project-${index}`
                      }
                    >

                      <div>

                        <strong>
                          {project.name}
                        </strong>

                        <span>
                          {project.client}
                        </span>

                      </div>


                      <div className="recent-progress">

                        <span>
                          {progress}%
                        </span>


                        <div className="mini-progress">

                          <div
                            style={{
                              width: `${progress}%`,
                            }}
                          />

                        </div>

                      </div>

                    </div>
                  );
                })
            ) : (
              <div className="empty-state">
                No projects available.
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;