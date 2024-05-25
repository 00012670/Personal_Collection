using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddUserLike : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collections_Categories_CategoryId",
                schema: "Users",
                table: "Collections");

            migrationBuilder.DropTable(
                name: "Categories",
                schema: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Collections_CategoryId",
                schema: "Users",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                schema: "Users",
                table: "Collections");

            migrationBuilder.AddColumn<int>(
                name: "Likes",
                schema: "Users",
                table: "Collections",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "UserLikes",
                schema: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CollectionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLikes", x => new { x.UserId, x.CollectionId });
                    table.ForeignKey(
                        name: "FK_UserLikes_Collections_CollectionId",
                        column: x => x.CollectionId,
                        principalSchema: "Users",
                        principalTable: "Collections",
                        principalColumn: "CollectionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserLikes_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Users",
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserLikes_CollectionId",
                schema: "Users",
                table: "UserLikes",
                column: "CollectionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserLikes",
                schema: "Users");

            migrationBuilder.DropColumn(
                name: "Likes",
                schema: "Users",
                table: "Collections");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                schema: "Users",
                table: "Collections",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Categories",
                schema: "Users",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Collections_CategoryId",
                schema: "Users",
                table: "Collections",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Collections_Categories_CategoryId",
                schema: "Users",
                table: "Collections",
                column: "CategoryId",
                principalSchema: "Users",
                principalTable: "Categories",
                principalColumn: "CategoryId");
        }
    }
}
