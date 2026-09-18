import React, {
  useMemo,
} from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ProjectStatusChart = ({
  projects = [],
}) => {
  const data = useMemo(() => {
    const statusCount = {};

    projects.forEach((project) => {
      const status =
        project.status || "Unknown";

      statusCount[status] =
        (statusCount[status] || 0) + 1;
    });

    return Object.entries(
      statusCount
    ).map(([name, value]) => ({
      name,
      value,
    }));
  }, [projects]);

  const colors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
  ];

  if (!projects.length) {
    return (
      <div className="chart-empty">
        No project data available.
      </div>
    );
  }

  return (
    <div className="status-chart">
      <ResponsiveContainer
        width="100%"
        height={280}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={55}
            paddingAngle={3}
          >
            {data.map(
              (entry, index) => (
                <Cell
                  key={entry.name}
                  fill={
                    colors[
                      index %
                        colors.length
                    ]
                  }
                />
              )
            )}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectStatusChart;