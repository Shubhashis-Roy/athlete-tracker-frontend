import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAthletes } from "@/context/AthleteContext";
import { sportsList } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;

const Athletes: React.FC = () => {
  const { isCoach } = useAuth();
  const { athletes, deleteAthlete } = useAthletes();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter athletes
  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      const matchesSearch =
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSport =
        sportFilter === "all" || athlete.sport === sportFilter;
      return matchesSearch && matchesSport;
    });
  }, [athletes, searchQuery, sportFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAthletes.length / ITEMS_PER_PAGE);
  const paginatedAthletes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAthletes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAthletes, currentPage]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sportFilter]);

  const handleDelete = () => {
    if (deleteId) {
      deleteAthlete(deleteId);
      toast.success("Athlete deleted successfully");
      setDeleteId(null);
    }
  };

  const uniqueSports = useMemo(() => {
    const sports = new Set(athletes.map((a) => a.sport));
    return Array.from(sports);
  }, [athletes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted-foreground">
            Manage your team of {athletes.length} athletes
          </p>
        </div>
        {isCoach && (
          <Button variant="accent" asChild>
            <Link to="/athletes/add">
              <Plus className="w-4 h-4" />
              Add Athlete
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search athletes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by sport" />
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
          </div>
        </CardContent>
      </Card>

      {/* Athletes Grid */}
      {paginatedAthletes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedAthletes.map((athlete) => (
            <Card key={athlete._id} className="card-hover overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-accent/10 overflow-hidden flex-shrink-0">
                      {athlete.imageUrl ? (
                        <img
                          src={athlete.imageUrl}
                          alt={athlete.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-accent font-bold text-xl">
                          {athlete.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-lg truncate">
                        {athlete.name}
                      </h3>
                      <p className="text-sm text-accent font-medium">
                        {athlete.sport}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <span>{athlete.age} years</span>
                        <span>•</span>
                        <span className="capitalize">{athlete.gender}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                    <p className="text-muted-foreground truncate">
                      📧 {athlete.email}
                    </p>
                    <p className="text-muted-foreground">📱 {athlete.phone}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t">
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-none h-12"
                    onClick={() => navigate(`/athletes/${athlete._id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  {isCoach && (
                    <>
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-none h-12 border-l"
                        onClick={() =>
                          navigate(`/athletes/edit/${athlete._id}`)
                        }
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-none h-12 border-l text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(athlete._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">
              No Athletes Found
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || sportFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start by adding your first athlete"}
            </p>
            {isCoach && !searchQuery && sportFilter === "all" && (
              <Button variant="accent" asChild>
                <Link to="/athletes/add">
                  <Plus className="w-4 h-4" />
                  Add Athlete
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredAthletes.length)} of{" "}
            {filteredAthletes.length} athletes
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-4">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Athlete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this athlete? This action cannot
              be undone and will also delete all associated test scores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Athletes;
