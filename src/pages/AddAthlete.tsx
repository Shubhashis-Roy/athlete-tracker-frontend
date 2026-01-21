import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save, User } from "lucide-react";
import { useAthletes } from "@/context/AthleteContext";
import { sportsList } from "@/data/mockData";
import { Athlete } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type AthleteFormData = Omit<Athlete, "id" | "createdAt">;

const AddAthlete: React.FC = () => {
  const navigate = useNavigate();
  const { addAthlete } = useAthletes();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AthleteFormData>({
    defaultValues: {
      name: "",
      age: 18,
      gender: "male",
      sport: "",
      email: "",
      phone: "",
    },
  });

  // const onSubmit = async (data: AthleteFormData) => {
  //   try {
  //     addAthlete(data);
  //     console.log(data, "data hlo ===============");

  //     toast.success("Athlete added successfully!");
  //     reset();
  //     // navigate("/athletes");
  //   } catch (error) {
  //     toast.error("Failed to add athlete. Please try again.");
  //   }
  // };

  const onSubmit = async (data: AthleteFormData) => {
    try {
      await addAthlete(data);

      toast.success("Athlete added successfully!");

      reset();
      navigate("/athletes");
    } catch (error) {
      toast.error("Failed to add athlete. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <User className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-display">Add New Athlete</h2>
              <p className="text-sm font-normal text-muted-foreground">
                Enter the athlete's information below
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                placeholder="Enter athlete's name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium">
                  Age <span className="text-destructive">*</span>
                </label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 10, message: "Age must be at least 10" },
                    max: { value: 100, message: "Age must be less than 100" },
                    valueAsNumber: true,
                  })}
                />
                {errors.age && (
                  <p className="text-sm text-destructive">
                    {errors.age.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Gender <span className="text-destructive">*</span>
                </label>
                <Select
                  value={watch("gender")}
                  onValueChange={(value: "male" | "female" | "other") =>
                    setValue("gender", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sport */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Sport <span className="text-destructive">*</span>
              </label>
              <Select
                value={watch("sport")}
                onValueChange={(value) => setValue("sport", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  {sportsList.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!watch("sport") && (
                <input
                  type="hidden"
                  {...register("sport", { required: "Sport is required" })}
                />
              )}
              {errors.sport && (
                <p className="text-sm text-destructive">
                  {errors.sport.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="athlete@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone <span className="text-destructive">*</span>
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                {...register("phone", {
                  required: "Phone is required",
                  minLength: {
                    value: 10,
                    message: "Phone must be at least 10 characters",
                  },
                })}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/athletes")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Athlete
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAthlete;
