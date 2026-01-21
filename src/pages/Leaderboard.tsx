import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Medal, Download, Filter, Eye } from "lucide-react";
import { useAthletes } from "@/context/AthleteContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import ViewAthleteSkeleton from "@/skeleton/ViewAthleteSkeleton";

interface LeaderboardEntry {
  athlete: string;
  totalScore: number;
  averageScore: number;
}

const Leaderboard: React.FC = () => {
  const { getLeaderboard, athletes } = useAthletes();

  const [sportFilter, setSportFilter] = useState<string>("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      const data = await getLeaderboard();
      setLeaderboard(data);
      setLoading(false);
    };

    load();
  }, []);

  const filteredLeaderboard = useMemo(() => {
    if (!leaderboard) return [];

    let enriched = leaderboard.map((entry) => {
      const athleteData = athletes.find((a) => a.name === entry.athlete);

      return {
        ...entry,
        athlete: athleteData || {
          name: entry.athlete,
          sport: "Unknown",
          id: "",
          imageUrl: "",
        },
      };
    });

    if (sportFilter !== "all") {
      enriched = enriched.filter(
        (entry) => entry.athlete.sport === sportFilter
      );
    }

    return enriched.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }, [leaderboard, sportFilter, athletes]);

  const uniqueSports = useMemo(() => {
    const sports = new Set(athletes.map((a) => a.sport));
    return Array.from(sports);
  }, [athletes]);

  const exportToCSV = () => {
    const headers = ["Rank", "Name", "Sport", "Total Score"];

    const rows = filteredLeaderboard.map((entry) => [
      entry.rank,
      entry.athlete.name,
      entry.athlete.sport,
      entry.totalScore,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leaderboard.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Leaderboard exported successfully!");
  };

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-2xl">🥇</span>;
      case 2:
        return <span className="text-2xl">🥈</span>;
      case 3:
        return <span className="text-2xl">🥉</span>;
      default:
        return <span className="font-bold">{rank}</span>;
    }
  };

  if (loading) {
    return <ViewAthleteSkeleton />;
  } else if (!filteredLeaderboard?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Medal className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h3 className="font-display text-xl font-bold mb-2">
            No Rankings Yet
          </h3>
          <p className="text-muted-foreground text-center">
            No leaderboard data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const topThree = filteredLeaderboard?.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
            <Trophy className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">
              Performance Leaderboard
            </h2>
            <p className="text-muted-foreground">
              {filteredLeaderboard.length} athletes ranked
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {uniqueSports.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={filteredLeaderboard.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {filteredLeaderboard.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topThree.map((entry, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="pt-6 text-center">
                  <div className="text-5xl mb-4">
                    {getRankDisplay(entry.rank)}
                  </div>

                  <h3 className="font-display font-bold text-lg">
                    {entry.athlete.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {entry.athlete.sport}
                  </p>

                  <p className="text-3xl font-display font-bold mt-2">
                    {entry.totalScore}
                  </p>

                  <p className="text-xs text-muted-foreground">points</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Full Rankings</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Athlete</TableHead>
                      <TableHead>Sport</TableHead>
                      <TableHead className="text-right">Total Score</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredLeaderboard.map((entry) => (
                      <TableRow key={entry.rank}>
                        <TableCell>{getRankDisplay(entry.rank)}</TableCell>

                        <TableCell>{entry.athlete.name}</TableCell>

                        <TableCell>{entry.athlete.sport}</TableCell>

                        <TableCell className="text-right font-bold">
                          {entry.totalScore}
                        </TableCell>

                        <TableCell>
                          {entry.athlete.id && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/athletes/${entry.athlete.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
