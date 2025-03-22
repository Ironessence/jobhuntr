"use client";

import UserLevelDisplay from "@/components/navbar/UserLevelDisplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { challenges, getChallengeById, getCompletedChallenges } from "@/constants/challenges";
import { useUserContext } from "@/context/AuthContext";
import { Building, DollarSign, FileText, MessageSquare, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function UserProfile() {
  const { user } = useUserContext();
  const router = useRouter();

  if (!user) {
    router.push("/auth");
    return null;
  }

  const completedChallengeIds = getCompletedChallenges(user.progress);
  const completedChallenges = completedChallengeIds
    .map((id) => getChallengeById(id))
    .filter(Boolean);

  const pendingChallenges = challenges.filter(
    (challenge) => !completedChallengeIds.includes(challenge.id),
  );

  const activityMetrics = [
    {
      title: "Cover Letters",
      value: user.progress.coverLettersGenerated || 0,
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Company Insights",
      value: user.progress.companyInsightsGenerated || 0,
      icon: <Building className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "Salary Insights",
      value: user.progress.salaryInsightsGenerated || 0,
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      color: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Interview Preps",
      value: user.progress.interviewPrepsGenerated || 0,
      icon: <MessageSquare className="h-5 w-5 text-orange-500" />,
      color: "bg-orange-100 dark:bg-orange-900",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{user.email}</p>

                <UserLevelDisplay user={user} />

                <div className="mt-4 w-full">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/dashboard/settings")}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity and Challenges */}
        <div className="md:col-span-2">
          <Tabs defaultValue="activity">
            <TabsList className="mb-4">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Your Activity</CardTitle>
                  <CardDescription>Track your usage of ApplyNinja features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activityMetrics.map((metric, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center p-4 rounded-lg border"
                      >
                        <div className={`p-3 rounded-full ${metric.color} mb-2`}>{metric.icon}</div>
                        <h3 className="font-medium text-center">{metric.title}</h3>
                        <p className="text-2xl font-bold">{metric.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Recent Activity</h3>
                    {user.progress.completedChallenges.length > 0 ? (
                      <div className="space-y-2">
                        {user.progress.completedChallenges
                          .sort(
                            (a, b) =>
                              new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
                          )
                          .slice(0, 5)
                          .map((challenge, index) => {
                            const challengeDetails = getChallengeById(challenge.challengeId);
                            if (!challengeDetails) return null;

                            return (
                              <div
                                key={index}
                                className="flex items-center p-2 rounded-md border"
                              >
                                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
                                  <Trophy className="h-4 w-4 text-blue-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{challengeDetails.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Completed on{" "}
                                    {new Date(challenge.completedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No activity yet. Start using ApplyNinja features!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="challenges">
              <Card>
                <CardHeader>
                  <CardTitle>Challenges</CardTitle>
                  <CardDescription>Complete challenges to earn rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Completed Challenges</h3>
                    {completedChallenges.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {completedChallenges.map((challenge, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 rounded-md border bg-muted/30"
                          >
                            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 mr-3 mt-1">
                              {challenge && <challenge.icon className="h-4 w-4 text-green-500" />}
                            </div>
                            <div>
                              <p className="font-medium">{challenge?.title}</p>
                              <p className="text-xs text-muted-foreground mb-1">
                                {challenge?.description}
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                  +{challenge?.experienceReward} XP
                                </span>
                                <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                                  +{challenge?.tokenReward} Tokens
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No challenges completed yet.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Available Challenges</h3>
                    {pendingChallenges.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {pendingChallenges.slice(0, 6).map((challenge, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 rounded-md border"
                          >
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3 mt-1">
                              <challenge.icon className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-medium">{challenge.title}</p>
                              <p className="text-xs text-muted-foreground mb-1">
                                {challenge.description}
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                  +{challenge.experienceReward} XP
                                </span>
                                <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                                  +{challenge.tokenReward} Tokens
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        You&apos;ve completed all available challenges!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile />
    </Suspense>
  );
}
