import React from "react";
import { HiCheckBadge } from "react-icons/hi2";

const Tools = () => {
    return (
        <div className="skills__content">
            <h3 className="skills__title">Project Management</h3>
            <div className="skills__box">
                <div className="skills__group">
                    <div className="skills__data">
                        <HiCheckBadge />
                        <div>
                            <h3 className="skills__name">Linear 📋</h3>
                            <span className="skills__level">Advanced</span>
                        </div>
                    </div>
                    <div className="skills__data">
                        <HiCheckBadge />
                        <div>
                            <h3 className="skills__name">Jira 🎯</h3>
                            <span className="skills__level">Intermediate</span>
                        </div>
                    </div>
                </div>
                <div className="skills__group">
                    <div className="skills__data">
                        <HiCheckBadge />
                        <div>
                            <h3 className="skills__name">Slack 💬</h3>
                            <span className="skills__level">Advanced</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tools;
