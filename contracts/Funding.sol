// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// import "hardhat/console.sol";

contract Funding {
    enum ProjectStatus {
        Active,
        Successful,
        Failed
    }
    struct Project {
        string title;
        string description;
        address payable creator;
        uint deadline;
        uint targetAmount;
        uint donateAmount;
        mapping(address => uint) donations;
        ProjectStatus status;
    }

    Project[] public projects;
    uint8 public projectCount;

    function createProject(
        string calldata title_,
        string calldata description_,
        uint deadline_,
        uint targetAmount_
    ) external {
        Project storage project = projects.push();
        project.title = title_;
        project.description = description_;
        project.deadline = deadline_;
        project.targetAmount = targetAmount_;
        project.creator = payable(msg.sender);
        project.status = ProjectStatus.Active;
        projectCount++;
    }

    function donate(uint8 projectIdx) external payable {
        require(projectIdx < projects.length, "project id not exist");
        Project storage project = projects[projectIdx];
        require(
            project.status == ProjectStatus.Active,
            "project is not active"
        );
        require(project.deadline > block.timestamp, "project is completed.");
        require(msg.value > 0, "donation value should great then 0");
        project.donateAmount += msg.value;
        project.donations[msg.sender] = msg.value;
    }

    function withdraw(uint8 projectIdx) external {
        require(projectIdx < projects.length, "project id not exist");
        Project storage project = projects[projectIdx];
        require(msg.sender == project.creator, "only creator can withdraw.");
        require(
            block.timestamp > project.deadline,
            "project is not completed."
        );
        require(
            project.targetAmount < project.donateAmount,
            "amount is not reach the goal."
        );
        require(project.status != ProjectStatus.Successful, "already withdraw");
        project.status = ProjectStatus.Successful;
        (bool success, ) = project.creator.call{value: project.donateAmount}(
            ""
        );
        require(success, "withdraw failed");
    }

    function refund(uint8 projectIdx) external {
        require(projectIdx < projects.length, "project id not exist");
        Project storage project = projects[projectIdx];
        uint amount = project.donations[msg.sender];
        require(amount > 0, "not allow to refund");
        project.donateAmount -= amount;
        project.donations[msg.sender] = 0;
        if (project.donateAmount == 0) {
            project.status = ProjectStatus.Failed;
        }
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "refund failed");
    }

    function getDetails(
        uint8 projectIdx
    )
        external
        view
        returns (
            string memory title,
            string memory description,
            address creator,
            uint deadline,
            uint targetAmount,
            uint donateAmount,
            ProjectStatus status
        )
    {
        require(projectIdx < projects.length, "project id not exist");
        Project storage project = projects[projectIdx];
        return (
            project.title,
            project.description,
            project.creator,
            project.deadline,
            project.targetAmount,
            project.donateAmount,
            project.status
        );
    }

    function getProjectDonationByPerson(
        uint8 projectIdx,
        address donor
    ) public view returns (uint) {
        require(projectIdx < projects.length, "project id not exist");
        Project storage project = projects[projectIdx];
        return project.donations[donor];
    }
}
