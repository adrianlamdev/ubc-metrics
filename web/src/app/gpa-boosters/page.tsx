"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Loader,
  AlertTriangle,
  Info,
  TrendingUp,
  Users,
  BookOpen,
  LineChart,
  Plus,
  Minus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartTooltip,
  ChartLegend,
  ChartConfig,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  predicted: {
    label: "Predicted Average",
    color: "hsl(var(--chart-1))",
  },
  historical: {
    label: "Historical Average",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const formSchema = z.object({
  minEnrollment: z.string().transform((val) => parseInt(val, 10)),
  maxYearLevel: z.string(),
  limit: z.string(),
  includeSubjects: z.string().optional(),
  excludeSubjects: z.string().optional(),
  minHistoricalAvg: z.string().transform((val) => parseFloat(val)),
});

export default function GpaBoosters() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minEnrollment: "50",
      maxYearLevel: "2",
      limit: "10",
      includeSubjects: "",
      excludeSubjects: "",
      minHistoricalAvg: "80",
    },
  });

  const handleCourseClick = (course) => {
    // TODO: more functionality , for example, open a modal with more details or navigate to a course page
    console.log("Course clicked:", course);
  };

  const onSubmit = async (values) => {
    setError("");
    setCourses(null);
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        limit: values.limit,
        min_enrollment: values.minEnrollment,
        max_year_level: values.maxYearLevel,
        include_subjects: values.includeSubjects || "",
        exclude_subjects: values.excludeSubjects || "",
        min_historical_avg: values.minHistoricalAvg,
      });

      const response = await fetch(`/api/v1/gpa-boosters?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch GPA boosters");

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError("Failed to fetch GPA boosters. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 mt-20"
    >
      <div className="max-w-3.5xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <CardTitle>GPA Boosters</CardTitle>
                <CardDescription>
                  Find courses with historically high grades based on enrollment
                  and year level.
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        name: "minEnrollment",
                        label: "Minimum Enrollment",
                        type: "number",
                        description: "Minimum number of enrolled students",
                        placeholder: "50",
                        icon: <Users className="h-3.5 w-3.5" />,
                      },
                      {
                        name: "maxYearLevel",
                        label: "Maximum Year Level",
                        type: "select",
                        description: "Maximum course level to include",
                        options: [
                          { value: "1", label: "100 Level" },
                          { value: "2", label: "200 Level" },
                          { value: "3", label: "300 Level" },
                          { value: "4", label: "400 Level" },
                        ],
                        icon: <BookOpen className="h-3.5 w-3.5" />,
                      },
                      {
                        name: "minHistoricalAvg",
                        label: "Minimum Historical Average (%)",
                        type: "number",
                        description:
                          "Minimum historical grade average to include",
                        placeholder: "80",
                        icon: <TrendingUp className="h-3.5 w-3.5" />,
                      },
                      {
                        name: "limit",
                        label: "Number of Results",
                        type: "select",
                        description: "Number of courses to display",
                        options: [
                          { value: "5", label: "5 courses" },
                          { value: "10", label: "10 courses" },
                          { value: "20", label: "20 courses" },
                          { value: "50", label: "50 courses" },
                        ],
                        icon: <LineChart className="h-3.5 w-3.5" />,
                      },
                      {
                        name: "includeSubjects",
                        label: "Include Subjects (Optional)",
                        type: "text",
                        description: "Comma-separated subject codes to include",
                        placeholder: "e.g., CPSC,MATH,STAT",
                        icon: <Plus className="h-3.5 w-3.5" />,
                      },
                      {
                        name: "excludeSubjects",
                        label: "Exclude Subjects (Optional)",
                        type: "text",
                        description: "Comma-separated subject codes to exclude",
                        placeholder: "e.g., BIOL,CHEM,PHYS",
                        icon: <Minus className="h-3.5 w-3.5" />,
                      },
                    ].map((field, index) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <FormField
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem className="bg-secondary/50 p-4 rounded-lg border border-secondary transition-all duration-300 hover:border-primary/20">
                              <FormLabel className="flex items-center gap-2">
                                <span className="p-1.5 bg-primary/10 rounded-full">
                                  {field.icon}
                                </span>
                                {field.label}
                              </FormLabel>
                              <FormControl>
                                {field.type === "select" ? (
                                  <Select
                                    onValueChange={formField.onChange}
                                    value={formField.value}
                                  >
                                    <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                                      <SelectValue
                                        placeholder={`Select ${field.label.toLowerCase()}`}
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {field.options.map((option) => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    {...formField}
                                    className="bg-background/50 backdrop-blur-sm"
                                  />
                                )}
                              </FormControl>
                              <FormDescription className="text-xs">
                                {field.description}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <Alert className="border-amber-600/30 bg-amber-600/40 shadow mt-6">
                      <AlertTitle className="text-amber-500 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                        Important
                      </AlertTitle>
                      <AlertDescription className="text-sm mt-1.5">
                        Past performance does not guarantee future results.
                        Course difficulty and grading may vary by instructor and
                        term.
                      </AlertDescription>
                    </Alert>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      disabled={isLoading || !form.formState.isValid}
                    >
                      {isLoading ? (
                        <>
                          <Loader className="mr-2 h-3.5 w-3.5 animate-spin" />
                          <span>Finding Courses...</span>
                        </>
                      ) : (
                        "Find GPA Boosters"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </CardContent>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4"
              >
                {[...Array(parseInt(form.watch("limit")))].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </motion.div>
            )}

            {courses && (
              <CardFooter className="flex flex-col space-y-6 mt-6">
                <div className="w-full">
                  <h3 className="text-lg font-semibold mb-4">
                    Top {courses.courses.length} GPA Boosters
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.courses.map((course, index) => (
                      <motion.div
                        key={`${course.subject}${course.course}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card
                          className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-secondary/50 to-secondary border-none overflow-hidden relative cursor-pointer"
                          onClick={() => handleCourseClick(course)}
                        >
                          {/* Decorative background element */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-70 transition-opacity duration-300" />

                          {/* Rank indicator */}
                          <div className="absolute top-3 right-3">
                            <div className="px-3 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full text-xs font-medium text-primary border border-primary/20 shadow-sm">
                              #{index + 1}
                            </div>
                          </div>

                          <CardHeader className="pb-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-2xl font-bold tracking-tight">
                                  {course.subject} {course.course}
                                </CardTitle>
                              </div>
                              <CardDescription className="text-sm">
                                {course.title || "Course Title Here"}
                              </CardDescription>
                            </div>
                          </CardHeader>

                          <CardContent>
                            <div className="grid grid-cols-2 gap-6 mt-4">
                              {/* Predicted Average */}
                              <div className="space-y-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                                        Predicted Average
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        Expected grade based on historical data
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <div className="relative">
                                  <div className="text-3xl font-bold text-emerald-400">
                                    {course.predicted_avg}%
                                  </div>
                                  <div className="absolute -top-1 -right-1 h-8 w-8 bg-emerald-500/10 rounded-full blur-lg" />
                                </div>
                              </div>

                              {/* Historical Average */}
                              <div className="space-y-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                                        <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                                        Historical Average
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Average grade from past offerings</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <div className="relative">
                                  <div className="text-3xl font-bold text-blue-500">
                                    {course.historical_avg}%
                                  </div>
                                  <div className="absolute -top-1 -right-1 h-8 w-8 bg-blue-500/10 rounded-full blur-lg" />
                                </div>
                              </div>
                            </div>

                            {/* Additional Stats */}
                            <div className="mt-6 pt-4 border-t">
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5" />
                                        {course.total_enrollment || "50+"}{" "}
                                        students
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Total enrolled students</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="flex items-center gap-1.5">
                                        <Info className="h-3.5 w-3.5" />
                                        {course.year_level}00 Level
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Course difficulty level</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </CardContent>

                          {/* Hover indicator */}
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-8" />

                  {/* Chart */}
                  <div className="flex justify-center">
                    {form.watch("limit") <= 10 ? (
                      <div className="">
                        <ChartContainer
                          config={chartConfig}
                          className="min-h-[225px] w-[90vw] pr-10"
                        >
                          <BarChart data={courses.courses}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey={(v) => `${v.subject} ${v.course}`}
                              angle={-45}
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              textAnchor="end"
                              interval={0}
                            />
                            <YAxis domain={[60, 100]} />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent indicator="bar" />}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar
                              dataKey="predicted_avg"
                              name={chartConfig.predicted.label}
                              fill="var(--color-predicted)"
                            />
                            <Bar
                              dataKey="historical_avg"
                              name={chartConfig.historical.label}
                              fill="var(--color-historical)"
                            />
                          </BarChart>
                        </ChartContainer>

                        <div className="mt-6 text-xs text-muted-foreground text-center">
                          Generated in{" "}
                          {(courses.timing.total_time * 1000).toFixed()}ms •
                          Considered {courses.metadata.total_courses_considered}{" "}
                          courses
                        </div>
                      </div>
                    ) : (
                      <Alert className="border-amber-600/30 bg-amber-600/40 shadow mt-6">
                        <AlertTitle className="text-amber-500 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                          Chart Not Displayed
                        </AlertTitle>
                        <AlertDescription className="text-sm mt-1.5">
                          Chart is only available for 10 or fewer courses.
                          Please reduce the number of results to view the chart.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
