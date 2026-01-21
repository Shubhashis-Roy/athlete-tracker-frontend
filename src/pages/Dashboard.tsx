import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Trophy,
  Activity,
  TrendingUp,
  ArrowRight,
  Medal,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAthletes } from "@/context/AthleteContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import leaderboardService from "@/services/leaderboardService";

interface LeaderboardEntry {
  athlete: string;
  totalScore: number;
  averageScore: number;
}

const Dashboard: React.FC = () => {
  const { user, isCoach } = useAuth();
  const { athletes, testScores } = useAthletes();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await leaderboardService.getLeaderboard();
      setLeaderboard(data);
    };

    load();
  }, []);

  // Enrich leaderboard with athlete data and rank
  const enrichedLeaderboard = useMemo(() => {
    return leaderboard.map((entry, index) => {
      const athleteData = athletes.find((a) => a.name === entry.athlete);

      return {
        ...entry,
        rank: index + 1,
        athlete: athleteData || {
          id: "",
          name: entry.athlete,
          sport: "Unknown",
          imageUrl: "",
        },
      };
    });
  }, [leaderboard, athletes]);

  const stats = [
    {
      title: "Total Athletes",
      value: athletes.length,
      icon: Users,
      color: "bg-blue-500",
      change: "+2 this month",
    },
    {
      title: "Tests Recorded",
      value: testScores.length,
      icon: Activity,
      color: "bg-accent",
      change: "+5 this week",
    },
    {
      title: "Average Score",
      value:
        leaderboard.length > 0
          ? Math.round(
              leaderboard.reduce((acc, e) => acc + e.totalScore, 0) /
                leaderboard.length
            )
          : 0,
      icon: TrendingUp,
      color: "bg-emerald-500",
      change: "+3% vs last month",
    },
    {
      title: "Top Score",
      value: leaderboard[0]?.totalScore || 0,
      icon: Trophy,
      color: "bg-amber-500",
      change: leaderboard[0]?.athlete || "N/A",
    },
  ];

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-xl">🥇</span>;
      case 2:
        return <span className="text-xl">🥈</span>;
      case 3:
        return <span className="text-xl">🥉</span>;
      default:
        return (
          <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
            {rank}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">
            Welcome back,{" "}
            <span className="text-gradient">
              {user?.name
                ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                : ""}
            </span>
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your athletes today.
          </p>
        </div>

        {isCoach && (
          <Button variant="accent" asChild>
            <Link to="/athletes/add">
              Add New Athlete
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-display font-bold mt-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </div>

                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-accent" />
              Top Performers
            </CardTitle>

            <Button variant="ghost" size="sm" asChild>
              <Link to="/leaderboard">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {enrichedLeaderboard.slice(0, 5).map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  {getRankBadge(entry.rank)}

                  <div className="w-12 h-12 rounded-full bg-accent/10 overflow-hidden">
                    {entry.athlete.imageUrl ? (
                      <img
                        src={entry.athlete.imageUrl}
                        alt={entry.athlete.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent font-bold">
                        {entry.athlete.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {entry.athlete.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {entry.athlete.sport}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-display font-bold text-lg">
                      {entry.totalScore}
                    </p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}

              {leaderboard.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No test scores recorded yet.</p>

                  {isCoach && (
                    <Button variant="accent" size="sm" className="mt-4" asChild>
                      <Link to="/tests">Add Test Scores</Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/athletes">View All Athletes</Link>
            </Button>

            {isCoach && (
              <>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/athletes/add">Add New Athlete</Link>
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link to="/tests">Record Test Scores</Link>
                </Button>
              </>
            )}

            <Button variant="outline" className="w-full" asChild>
              <Link to="/leaderboard">View Leaderboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
