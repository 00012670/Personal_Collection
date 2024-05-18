using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class updateCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collections_Categories_CategoryID",
                schema: "Users",
                table: "Collections");

            migrationBuilder.RenameColumn(
                name: "CategoryID",
                schema: "Users",
                table: "Collections",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Collections_CategoryID",
                schema: "Users",
                table: "Collections",
                newName: "IX_Collections_CategoryId");

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                schema: "Users",
                table: "Collections",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "Category",
                schema: "Users",
                table: "Collections",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Collections_Categories_CategoryId",
                schema: "Users",
                table: "Collections",
                column: "CategoryId",
                principalSchema: "Users",
                principalTable: "Categories",
                principalColumn: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collections_Categories_CategoryId",
                schema: "Users",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Category",
                schema: "Users",
                table: "Collections");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                schema: "Users",
                table: "Collections",
                newName: "CategoryID");

            migrationBuilder.RenameIndex(
                name: "IX_Collections_CategoryId",
                schema: "Users",
                table: "Collections",
                newName: "IX_Collections_CategoryID");

            migrationBuilder.AlterColumn<int>(
                name: "CategoryID",
                schema: "Users",
                table: "Collections",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Collections_Categories_CategoryID",
                schema: "Users",
                table: "Collections",
                column: "CategoryID",
                principalSchema: "Users",
                principalTable: "Categories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
