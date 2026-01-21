import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Activity,
  Timer,
  ArrowUp,
  Zap,
  Heart,
  Save,
  RotateCcw,
} from "lucide-react";
import { useAthletes } from "@/context/AthleteContext";
import { TestScore } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type TestScoreFormData = Omit<TestScore, "_id" | "createdAt">;

const TestScores: React.FC = () => {
  const {
    athletes,
    addScore,
    addTests,
    getLatestTestScore,
    getTestScoresByAthleteId,
  } = useAthletes();

  const [selectedAthleteId, setSelectedAthleteId] = useState<string>("");
  const [existingScore, setExistingScore] = useState<any>(null);

  const selectedAthlete = athletes.find((a) => a._id === selectedAthleteId);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestScoreFormData>({
    defaultValues: {
      athleteId: "",
      sprintTime: 0,
      verticalJump: 0,
      agilityTest: 0,
      enduranceTest: 0,
    },
  });

  useEffect(() => {
    const loadExisting = async () => {
      if (selectedAthleteId) {
        try {
          const existing = await getTestScoresByAthleteId(selectedAthleteId);
          setExistingScore(existing);
        } catch (error) {
          console.error("Failed to load latest test score", error);
          console.error("Failed to load latest test score", error);
        }
      }
    };

    loadExisting();
  }, [selectedAthleteId]);

  const handleAthleteChange = async (athleteId: string) => {
    setSelectedAthleteId(athleteId);
    setValue("athleteId", athleteId);

    try {
      const existing = await getTestScoresByAthleteId(athleteId);

      setExistingScore(existing);

      if (existing) {
        setValue("sprintTime", existing.sprintTime);
        setValue("verticalJump", existing.verticalJump);
        setValue("agilityTest", existing.agilityTest);
        setValue("enduranceTest", existing.enduranceTest);
      }
    } catch (error) {
      console.error("Failed to load previous scores", error);
    }
  };

  const onSubmit = async (data: TestScoreFormData) => {
    if (!data.athleteId) {
      toast.error("Please select an athlete");
      return;
    }

    try {
      await addTests(data);
      toast.success("Test scores saved successfully!");
      reset();
      setSelectedAthleteId("");
      setExistingScore(null);
    } catch (error) {
      toast.error("Failed to save test scores. Please try again.");
    }
  };

  const testFields = [
    {
      _id: "sprintTime",
      label: "30m Sprint Time",
      icon: Timer,
      unit: "seconds",
      color: "bg-blue-500",
      description: "Time to complete 30 meter sprint",
    },
    {
      _id: "verticalJump",
      label: "Vertical Jump",
      icon: ArrowUp,
      unit: "cm",
      color: "bg-green-500",
      description: "Maximum vertical jump height",
    },
    {
      _id: "agilityTest",
      label: "Agility Test",
      icon: Zap,
      unit: "seconds",
      color: "bg-amber-500",
      description: "Time to complete agility course",
    },
    {
      _id: "enduranceTest",
      label: "Endurance Test",
      icon: Heart,
      unit: "minutes",
      color: "bg-red-500",
      description: "Duration of sustained activity",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Activity className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-display">Record Test Scores</h2>
              <p className="text-sm font-normal text-muted-foreground">
                Input physical test results for athletes
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select Athlete <span className="text-destructive">*</span>
            </label>
            <Select
              value={selectedAthleteId}
              onValueChange={handleAthleteChange}
            >
              <SelectTrigger className="h-14">
                <SelectValue placeholder="Choose an athlete to record scores" />
              </SelectTrigger>
              <SelectContent>
                {athletes.map((athlete) => (
                  <SelectItem key={athlete._id} value={athlete._id}>
                    {athlete.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAthlete && existingScore && (
            <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm text-accent font-medium">
                ℹ️ This athlete has existing test scores. The form is pre-filled
                with their latest results.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAthlete && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Test Results for {selectedAthlete.name}</CardTitle>
              <CardDescription>
                Enter the performance metrics from the latest tests
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <input type="hidden" {...register("athleteId")} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testFields.map((field) => (
                  <div key={field._id} className="flex flex-col gap-2">
                    {/* Show Label */}
                    <label className="font-medium text-sm">{field.label}</label>

                    <Input
                      type="number"
                      step={field.step}
                      placeholder={field.unit}
                      {...register(field._id as keyof TestScoreFormData, {
                        required: true,
                        valueAsNumber: true,
                      })}
                    />

                    {/* Optional description */}
                    <span className="text-xs text-gray-500">
                      {field.description}
                    </span>
                  </div>
                ))}
              </div>

              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                Save Test Scores
              </Button>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
};

export default TestScores;
