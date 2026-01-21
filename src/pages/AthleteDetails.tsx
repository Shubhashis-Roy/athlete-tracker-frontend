import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  Calendar,
  Activity,
  Trophy,
  Timer,
  ArrowUp,
  Zap,
  Heart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAthletes } from "@/context/AthleteContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Athlete, LeaderboardEntry, TestScore } from "@/types";
import ViewAthleteSkeleton from "@/skeleton/ViewAthleteSkeleton";

const AthleteDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isCoach } = useAuth();
  const { getAthleteById, getLatestTestScore, getLeaderboard } = useAthletes();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [athlete, setAthlete] = useState<Athlete>();
  const [testScore, setTestScore] = useState<TestScore>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      const data = await getLeaderboard();
      setLeaderboard(data);
      const athleteRes = await getAthleteById(id);
      setAthlete(athleteRes);
      setLoading(false);
      const testRes = await getLatestTestScore(id);
      setTestScore(testRes);
    };

    load();
  }, []);

  const ranking = leaderboard.find((e) => e.athlete._id === id);

  if (loading) {
    return <ViewAthleteSkeleton />;
  } else if (!athlete) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">Athlete Not Found</h2>
        <Button onClick={() => navigate("/athletes")}>Back to Athletes</Button>
      </div>
    );
  }

  const testMetrics = testScore
    ? [
        {
          label: "30m Sprint",
          value: `${testScore.sprintTime}s`,
          icon: Timer,
          color: "bg-blue-500",
        },
        {
          label: "Vertical Jump",
          value: `${testScore.verticalJump}cm`,
          icon: ArrowUp,
          color: "bg-green-500",
        },
        {
          label: "Agility Test",
          value: `${testScore.agilityTest}s`,
          icon: Zap,
          color: "bg-amber-500",
        },
        {
          label: "Endurance",
          value: `${testScore.enduranceTest}min`,
          icon: Heart,
          color: "bg-red-500",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-accent/10 overflow-hidden">
                {athlete.imageUrl ? (
                  <img
                    src={athlete.imageUrl}
                    alt={athlete.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-accent font-bold text-4xl">
                    {athlete.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold">
                    {athlete.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                      {athlete.sport}
                    </span>
                    {ranking && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          ranking.rank === 1
                            ? "rank-gold"
                            : ranking.rank === 2
                            ? "rank-silver"
                            : ranking.rank === 3
                            ? "rank-bronze"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        #{ranking.rank} Ranked
                      </span>
                    )}
                  </div>
                </div>

                {isCoach && (
                  <Button variant="outline" asChild>
                    <Link to={`/athletes/edit/${athlete._id}`}>
                      <Pencil className="w-4 h-4" />
                      Edit Profile
                    </Link>
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-5 h-5" />
                  <span>{athlete.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-5 h-5" />
                  <span>{athlete.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {athlete.age} years old • {athlete.gender}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Activity className="w-5 h-5" />
                  <span>
                    Joined {format(new Date(athlete.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ranking ? (
              <div className="text-center">
                <div className="text-6xl font-display font-bold text-gradient">
                  {ranking.totalScore}
                </div>
                <p className="text-muted-foreground mt-2">Total Points</p>
                <div className="mt-6 p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Leaderboard Position
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    #{ranking.rank}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      of {leaderboard.length}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No test scores recorded</p>
                {isCoach && (
                  <Button variant="accent" size="sm" className="mt-4" asChild>
                    <Link to="/tests">Add Test Score</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              Latest Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testScore ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {testMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-muted/50 flex items-center gap-4"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center`}
                      >
                        <metric.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {metric.label}
                        </p>
                        <p className="text-xl font-bold">{metric.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Last tested:{" "}
                  {format(new Date(testScore.createdAt), "MMM d, yyyy h:mm a")}
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  No test results available
                </p>
                {isCoach && (
                  <Button variant="accent" size="sm" className="mt-4" asChild>
                    <Link to="/tests">Record Test</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AthleteDetails;
