using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCollection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collections_Users_UserID",
                schema: "Users",
                table: "Collections");

            migrationBuilder.RenameColumn(
                name: "UserID",
                schema: "Users",
                table: "Collections",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Collections_UserID",
                schema: "Users",
                table: "Collections",
                newName: "IX_Collections_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Collections_Users_UserId",
                schema: "Users",
                table: "Collections",
                column: "UserId",
                principalSchema: "Users",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collections_Users_UserId",
                schema: "Users",
                table: "Collections");

            migrationBuilder.RenameColumn(
                name: "UserId",
                schema: "Users",
                table: "Collections",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Collections_UserId",
                schema: "Users",
                table: "Collections",
                newName: "IX_Collections_UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Collections_Users_UserID",
                schema: "Users",
                table: "Collections",
                column: "UserID",
                principalSchema: "Users",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
