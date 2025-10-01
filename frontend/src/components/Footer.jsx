import React from "react";

const Footer = ({completedTasksCount = 0, activeTasksCount = 0}) => {
    return (
        <>
        {completedTasksCount + activeTasksCount > 0 && (
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    {   completedTasksCount > 0 && (
                        <> Bạn đã hoàn thành {completedTasksCount} nhiệm vụ rồi.  </>
                    )} 
                    {
                        activeTasksCount > 0 && (
                            ` Chỉ còn ${activeTasksCount} nhiệm vụ nữa thôi. Cố lên nhé !`
                        )
                    }
                    
                    {/* {completedTasksCount === 0 && activeTasksCount > 0 && (
                        <>
                             Hãy bắt đầu làm {activeTasksCount} nhiệm vụ ngay bây giờ nhé!
                        </>
                    )} */}

                </p>
            </div>
        )}  
        {completedTasksCount === 0 && activeTasksCount === 0 && (
            <div className="text-center"> Vẫn chưa có nhiệm vụ nào cả, hãy bắt đầu lên kế hoạch làm việc ngay bây giờ thôi nào</div>
        )}
        </>
    );
}

export default Footer;