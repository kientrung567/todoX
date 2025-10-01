import React, { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";

const TaskCard = ({task, index, handleTaskChanged}) => {
    const [isEditting,setIsEditting] = useState(false);
    const [updateTaskTitle,setUpdateTaskTitle] = useState(task.title || "");


    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            updateTask(task._id);
        } 
    }

    const deleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            toast.success("Ban da xoa nhiem vu thanh cong");
            handleTaskChanged();
        } catch (error) {
            console.error("Loi xay ra khi xoa nhiem vu: ",error);
            toast.error("Nhiem vu da xoa khong thanh cong", error);
        }
    }

    const updateTask = async (taskId) => {
        try {
            setIsEditting(false);
            await api.put(`/tasks/${taskId}`, {
                title: updateTaskTitle
            });
            toast.success(`Ban da cap nhat nhiem vu ${updateTaskTitle} thanh cong`);
            handleTaskChanged();
        } catch (error) {
            console.error("Loi xay ra khi cap nhat nhiem vu: ",error);
            toast.error("Nhiem vu cap nhat khong thanh cong", error);
        }
    }

    const updateTaskStatus = async (taskId) => {
        try {
            const newStatus = task.status === "active" ? "complete" : "active";
            if (newStatus === "complete") {
                await api.put(`/tasks/${taskId}`, {
                status: newStatus,
                completedAt: new Date().toISOString(),
            });
                toast.success(`Ban da hoan thanh nhiem vu ${updateTaskTitle} thanh cong.`);
            }  else {
                await api.put(`/tasks/${taskId}`, {
                status: newStatus,
                completedAt: null,
            });
                toast.success(`Ban da chuyen nhiem vu ${updateTaskTitle} ve active thanh cong.`);
            }
            
            handleTaskChanged();
        } catch (error) {
            console.error("Loi xay ra khi cap nhat trang thai nhiem vu: ",error);
            toast.error("Trang thai nhiem vu cap nhat khong thanh cong", error);
        }
    }

    return (
        <Card className={cn(
            "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
            task.status === 'complete' && 'opacity-75'
        )}
            style={{animationDelay: `${index*50}ms`}}
        >
            <div className="flex items-center gap-4">
                {/* nút tròn */}
                <Button
                    variant='ghost'
                    size='icon'
                    className={cn(
                        "flex-shrink-0 size-8 rounded-full transition-all duration-200",
                        task.status === 'complete' ? 'text-success hover:text-success/80' :
                        'text-muted-foreground hover:text-primary'
                    )}
                    onClick={() => updateTaskStatus(task._id)}
                >
                    {task.status === "complete" ? (
                        <CheckCircle2 className="size-5"/>
                    ) : (
                        <Circle className="size-5"/>
                    )}
                </Button>
                 
                {/* hiển thị hoặc chỉnh sửa tiêu đề */}
                <div className="flex-1 min-w-0">
                    { isEditting ? (
                        <Input
                            placeholder=""
                            className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            type="text"
                            value={updateTaskTitle}
                            onChange={(event) => setUpdateTaskTitle(event.target.value)}
                            onKeyPress = {handleKeyPress}
                            onBlur = { () => {
                                setIsEditting(false);
                                setUpdateTaskTitle(task.title || '');
                            }}
                        />
                    ) : (
                        <p className={cn(
                            "text-base transition-all duration-200",
                            task.status === "complete" ?
                            "line-through text-muted-foreground"
                            : "text-foreground"
                        )}>
                            {task.title}    
                        </p>
                    )
                    }

                    {/* ngày tạo và ngày hoàn thành */} 
                    <div className="flex items-center gap-2 mt-1">
                        <Calendar className="size-3 text-muted-foreground"/>
                        <span className="text-xs text-muted-foreground">
                            {new Date(task.createdAt).toLocaleString()}
                        </span>
                        {task.completedAt && (
                            <> 
                                <span className="text-xs text-muted-foreground"> - </span>
                                <Calendar className="size-3 text-muted-foreground"/>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(task.completedAt).toLocaleString()}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* nút chỉnh và xóa */}
                <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
                    {/* nút edit */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
                        onClick={() => {
                            if (isEditting === false) {
                                setIsEditting(true);
                                setUpdateTaskTitle(task.title || "");
                            }
                        }}
                    >
                        <SquarePen className="size-4"/>
                    </Button>
                    {/* nút xóa */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTask(task._id)}
                    >
                        <Trash2 className="size-4"/>
                    </Button>
                </div>
            </div>
        </Card>
    );
}

export default TaskCard;