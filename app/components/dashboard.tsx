// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import { CalendarIcon, BarChart3 } from "lucide-react"
// import SLATable from "./sla-table"
// import MonthlySummary from "./monthly-summary"

// interface Project {
//   id: string
//   name: string
// }

// export default function Dashboard() {
//   const [projects, setProjects] = useState<Project[]>([])
//   const [selectedProject, setSelectedProject] = useState<string>("")
//   const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7))
//   const [slaData, setSlaData] = useState<any[]>([])
//   const [monthlySlaData, setMonthlySlaData] = useState<any | null>(null)
//   const [loading, setLoading] = useState<boolean>(false)
//   const [loadingMonthly, setLoadingMonthly] = useState<boolean>(false)
//   const [loadingProjects, setLoadingProjects] = useState<boolean>(true)

//   // Fetch projects on component mount
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setLoadingProjects(true)
//         const response = await fetch("/api/projects")
//         const data = await response.json()
//         setProjects(data)
//       } catch (error) {
//         console.error("Error fetching projects:", error)
//       } finally {
//         setLoadingProjects(false)
//       }
//     }

//     fetchProjects()
//   }, [])

//   // Fetch SLA data when project is selected
//   useEffect(() => {
//     const fetchSlaData = async () => {
//       if (!selectedProject) return

//       try {
//         setLoading(true)
//         const response = await fetch(`/api/sla?projectId=${selectedProject}`)
//         const data = await response.json()
//         setSlaData(data)
//       } catch (error) {
//         console.error("Error fetching SLA data:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchSlaData()
//   }, [selectedProject])

//   // Handle project selection
//   const handleProjectChange = (value: string) => {
//     setSelectedProject(value)
//     setMonthlySlaData(null) // Reset monthly data when project changes
//   }

//   // Handle month selection
//   const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedMonth(e.target.value)
//     setMonthlySlaData(null) // Reset monthly data when month changes
//   }

//   // Calculate monthly SLA
//   const calculateMonthlySla = async () => {
//     if (!selectedProject || !selectedMonth) return

//     try {
//       setLoadingMonthly(true)
//       const response = await fetch(`/api/sla/monthly?projectId=${selectedProject}&month=${selectedMonth}`)
//       const data = await response.json()
//       setMonthlySlaData(data)
//     } catch (error) {
//       console.error("Error calculating monthly SLA:", error)
//     } finally {
//       setLoadingMonthly(false)
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Card className="mb-8 border-blue-200 shadow-sm">
//         <CardHeader className="bg-blue-50 border-b border-blue-100">
//           <CardTitle className="text-2xl font-bold text-blue-900">SLA Dashboard</CardTitle>
//           <CardDescription className="text-blue-700">View and analyze Service Level Agreement metrics</CardDescription>
//         </CardHeader>
//         <CardContent className="bg-white">
//           <div className="grid gap-6 md:grid-cols-3">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Project</label>
//               {loadingProjects ? (
//                 <Skeleton className="h-10 w-full" />
//               ) : (
//                 <Select value={selectedProject} onValueChange={handleProjectChange}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a project" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {projects.map((project) => (
//                       <SelectItem key={project.id} value={project.id}>
//                         {project.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label htmlFor="month" className="text-sm font-medium">
//                 Month
//               </label>
//               <div className="relative">
//                 <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
//                 <input
//                   id="month"
//                   type="month"
//                   value={selectedMonth}
//                   onChange={handleMonthChange}
//                   className="pl-10 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                 />
//               </div>
//             </div>

//             <div className="flex items-end">
//               <Button
//                 onClick={calculateMonthlySla}
//                 disabled={!selectedProject || !selectedMonth || loadingMonthly}
//                 className="w-full bg-blue-600 hover:bg-blue-700"
//               >
//                 {loadingMonthly ? (
//                   <span className="flex items-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Calculating...
//                   </span>
//                 ) : (
//                   <span className="flex items-center">
//                     <BarChart3 className="mr-2 h-4 w-4" />
//                     Calculate Monthly SLA
//                   </span>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {selectedProject && (
//         <>
//           <Card className="mb-8 border-blue-200 shadow-sm">
//             <CardHeader className="bg-blue-50 border-b border-blue-100">
//               <CardTitle className="text-blue-900">SLA Entries</CardTitle>
//               <CardDescription className="text-blue-700">Daily SLA values for the selected project</CardDescription>
//             </CardHeader>
//             <CardContent className="bg-white">
//               <SLATable data={slaData} loading={loading} />
//             </CardContent>
//           </Card>

//           {monthlySlaData && (
//             <Card className="border-blue-200 shadow-sm">
//               <CardHeader className="bg-blue-50 border-b border-blue-100">
//                 <CardTitle className="text-blue-900">Monthly SLA Summary</CardTitle>
//                 <CardDescription className="text-blue-700">Average SLA values for {selectedMonth}</CardDescription>
//               </CardHeader>
//               <CardContent className="bg-white">
//                 <MonthlySummary data={monthlySlaData} />
//               </CardContent>
//             </Card>
//           )}
//         </>
//       )}
//     </div>
//   )
// }
