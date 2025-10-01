import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react"
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {

    const [taskBuffer,settaskBuffer] = useState([]);
    const [activeTasksCount, setactiveTasksCount] = useState(0);
    const [completeTasksCount, setcompleteTasksCount] = useState(0);
    const [filter, setFilter] = useState('all');
    const [dateQuery,setDateQuery] = useState("today");
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchTasks();
    },[dateQuery]);

    useEffect(() => {
        setPage(1);
    },[filter,dateQuery]);

    // logic
    const fetchTasks = async () => {
        try {
            // fetch
            // const res = await fetch("http://localhost:5001/api/tasks")
            // const data = await res.json();
            // settaskBuffer(data);
            // console.log(data);

            const res = await api.get(`/tasks?filter=${dateQuery}`)
            settaskBuffer(res.data.tasks);
            setactiveTasksCount(res.data.activeCount);
            setcompleteTasksCount(res.data.completeCount);
            console.log(res.data);
        } catch (error) {
            console.error("Loi xay ra khi truy xuat task: ", error);
            toast.error("Loi xay ra khi truy xuat tasks.");
        }
    }

    const handleTaskChanged = () => {
        fetchTasks();
    }

    const handleNext = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    }

    const handlePrev = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
    }

    // variables
    const filteredTasks = taskBuffer.filter((task) => {
        switch (filter) {
            case "active":
                return task.status === "active";
            case "complete":
                return task.status === "complete";
            default:
                return true;
        }
    })

    const visibleTasks = filteredTasks.slice(
        (page - 1) * visibleTaskLimit,
        page * visibleTaskLimit
    );

    if (visibleTasks.length === 0) {
        handlePrev();
    };

    const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

    return (
        <div className="min-h-screen w-full bg-[#fefcff] relative">
            {/* Dreamy Sky Pink Glow */}
            <div
                className="absolute inset-0 z-0"    
                style={{
                backgroundImage: `
                    radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
                    radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
                }}
            />
            <div className="container pt-8 mx-auto relative z-10">
                <div className="w-full max-w-2xl -6 mx-auto space-y-6">
                    <Header/>
                    <AddTask handleNewTaskAdded={handleTaskChanged}/>
                    <StatsAndFilters
                        filter={filter}
                        setFilter={setFilter}
                        activeTasksCount={activeTasksCount} 
                        completedTasksCount={completeTasksCount}/>
                    <TaskList 
                        filteredTasks={visibleTasks} 
                        filter={filter} 
                        handleTaskChanged = {handleTaskChanged}/>
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row"> 
                    <TaskListPagination
                        handleNext = {handleNext}
                        handlePrev = {handlePrev}
                        handlePageChange = {handlePageChange}
                        page = {page}    
                        totalPages = {totalPages}/>
                    <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery}/>
                    </div>
                    <Footer
                        activeTasksCount={activeTasksCount} 
                        completedTasksCount={completeTasksCount}/>
                </div>
            </div>     
        </div>
        
   
    )
}

export default HomePage;